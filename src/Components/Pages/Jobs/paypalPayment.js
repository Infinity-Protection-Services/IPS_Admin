import React from "react";
import * as actionTypes from "../../../Common/actionTypes";
import { getAuthenticatedUser } from "../../../Utils/storageUtils";
import { JobPayment, paymentEntity } from "../../../Common/entity";
import { stripeInstance } from "../../../Common/axiosInstance";
import { crudAction, } from "../../../Store/Actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withNamespaces } from "react-i18next";
import { commonActions } from "../../../Utils";

function PaypalPayment(props) {
  const { data } = props;
  const paymentPayload = {
    type: "jobPaymentToProvider",
    job_id: props.task === "pay" ? data.job_id : data.job_id,
    user_id: getAuthenticatedUser().user.id,
    provider_id:
      props.task === "pay" ? (props.data.provider_id || props.data.backup_provider_id) : data.provider_id,
    is_backup_provider: data.is_backup_provider,
    is_partial: props.is_partial,
    extra_work_amount: 0,
    total_amount: parseFloat(props.amount).toFixed(2),
    is_refund: props.task === "pay" ? 0 : 1,
    method: "stripe",
    transaction_id: data.transaction_id,
  };
  const PaymentWithAPI = () => {
    const payment_timestamp = Math.floor(new Date().getTime());
    const payload = {
      type: "payToProvider",
      amount: paymentPayload.total_amount,
      destinationId: data.destinationId_backup || data.destinationId_provider,
      transaction_id: data.transaction_id,
    };
    stripeInstance
      .post(paymentEntity, payload)
      .then((resp) => {
        const payload = {
          ...paymentPayload,
          payment_timestamp: payment_timestamp,
          transaction_id: resp.data.data.id,
          status: "success",
        };
        props.actions.setredux(
          "Amount payment successful",
          "success_message",
          actionTypes.SUCCESS_MESSAGE
        );
        props.actions.postAll(JobPayment, payload, "JobPayment");
      })
      .catch((err) => {
        props.actions.SetLoader(false);
        props.actions.setredux(err?.response?.data?.message || "Network error", 'error_message', actionTypes.ERROR_MESSAGE)
        const payload = {
          ...paymentPayload,
          payment_timestamp: payment_timestamp,
          transaction_id: "-",
          status: "failed",
        };
        props.actions.postAll(JobPayment, payload, "JobPayment");
        props.actions.setredux(
          "Error in Payment",
          "error_message",
          actionTypes.ERROR_MESSAGE
        );
      });
  };

  // To refund to requester with stripe
  const RefundAmount = () => {
    let totalRefundedAmount = 0;
    props.jobDetailsVisibility.job_payments_data.forEach((item) => {
      if (
        item.event_name.toLowerCase() === "refund" &&
        item.status.toLowerCase() === "success"
      ) {
        totalRefundedAmount += parseFloat(item.total_amount).toFixed(2);
      }
    });
    let IdApplicableToRefund,
      RefundAmountArray = [];

    props.jobDetailsVisibility.job_payments_data.every((element) => {
      if (
        parseFloat(element.total_amount - totalRefundedAmount) >
        paymentPayload.total_amount
      ) {
        RefundAmountArray = [];
        IdApplicableToRefund = element.transaction_id;
        return false;
      }
      RefundAmountArray.push(
        parseFloat(element.total_amount - totalRefundedAmount)
      );
      return true;
    });

    if (IdApplicableToRefund) {
      const payment_timestamp = Math.floor(new Date().getTime());
      const payload = {
        type: "refundToRequester",
        transaction_id: IdApplicableToRefund,
        amount: props.amount,
      };
      stripeInstance
        .post(paymentEntity, payload)
        .then((resp) => {
          const payload = {
            ...paymentPayload,
            payment_timestamp: payment_timestamp,
            transaction_id: resp.data.data.id,
            status: resp.data.statuscode === 200 ? "success" : "failed",
          };
          props.actions.setredux(
            "Amount refunded successful",
            "success_message",
            actionTypes.SUCCESS_MESSAGE
          );
          props.actions.postAll(JobPayment, payload, "JobPayment");
        })
        .catch((err) => {
          const payload = {
            ...paymentPayload,
            payment_timestamp: payment_timestamp,
            transaction_id: "-",
            status: "failed",
          };
          props.actions.postAll(JobPayment, payload, "JobPayment");
          props.actions.setredux(
            "Amount refunded failed",
            "error_message",
            actionTypes.ERROR_MESSAGE
          );
        });
    } else {
      props.actions.SetLoader(false);
      RefundAmountArray.every((element) => {
        if (paymentPayload.total_amount - element) {
          props.actions.setredux(
            "Please try to refund " +
            element +
            " at this time, Thank you for your patience.",
            "error_message",
            actionTypes.ERROR_MESSAGE
          );
          return false;
        }
        return true;
      });
    }
  };

  return (
    <>
      {/* To close component as it mounts */}
      {props.SuccessPayment()}

      {/* separate whether payment or refund */}
      {props.task === "pay"
        ? PaymentWithAPI()
        : props.task === "refund"
          ? RefundAmount()
          : ""}
    </>
  );
}
const mapStateToProps = ({ crud, layout }) => {
  return { ...crud, ...layout }
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Object.assign({}, crudAction, commonActions), dispatch),
});

export default withNamespaces()(connect(mapStateToProps, mapDispatchToProps)(PaypalPayment))
