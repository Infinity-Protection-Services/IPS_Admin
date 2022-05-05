import moment from 'moment';
import { Button, FormGroup } from "reactstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withNamespaces } from "react-i18next";
import { MDBDataTable, MDBIcon } from "mdbreact";
import React, { useState, useEffect } from "react";
import { AvForm, AvField, AvRadioGroup, AvRadio } from "availity-reactstrap-validation";
import SweetAlert from "react-bootstrap-sweetalert";
import { Back_arrow } from "../../../Assets/Images/web";
import * as actionTypes from '../../../Common/actionTypes'
import { crudAction } from "../../../Store/Actions";
import { commonMethods, commonActions } from "../../../Utils";
import PaypalPayment from '../Jobs/paypalPayment'

export const RenderDetails = (props) => {
  const { label, value } = props
  return <div className="label">
    <p className="job-detail-label-p ">{label}</p>
    <div className="detail d-flex">:  <span className="details_width_wrapper">
      {value}
    </span>
    </div>
  </div>
}


function PaymentDetails(props) {
  const { Data, metaData } = props
  const [data, setData] = useState({ columns: [], rows: [], });
  const [confirmPayment, setConfirmPayment] = useState({ visibility: false, task: '', amount: 0 })
  const [payOrRefund, setPayOrRefund] = useState("");
  const [providerName, setProviderName] = useState("");
  const provider_data = String(providerName).split(' ').map(Number)
  const [providerType, setProviderType] = useState(null)
  const payableAmount = Data.commision_rate ?
    parseFloat(Data.recommended_rate - parseFloat(Data.recommended_rate * Data.commision_rate / 100) - Data.send_payment).toFixed(2)
    : Data.recommended_rate - Data.send_payment

  let primary_provider = Data.provider_personal_detail.filter((x) => x.is_backup_provider === 0) || [];

  const new_backup_provider = Data.backup_provider_personal_detail.filter((x) => x.is_backup_provider === 1) || [];

  let temp_ampunt = 0;
  // set Table Column
  useEffect(() => {
    setData({
      ...data,
      columns: [
        { label: props.t("No"), field: "index" },
        { label: props.t("Transaction"), field: "transaction_auth" },
        { label: props.t("Payment Gateway"), field: "method" },
        { label: props.t("Action"), field: "action" },
        { label: props.t("Amount Received"), field: "amount_received" },
        { label: props.t("Amount Paid"), field: "amount_paid" },
        { label: props.t("Transaction Date"), field: "transaction_date" },
        { label: props.t("Invoice No"), field: "invoice_no" },
        { label: props.t("Transaction Id"), field: "transaction_id" },
        { label: props.t("Status"), field: "temp_status" }
      ]
    })
  }, [props.t])

  useEffect(() => {
    return () => { props.actions.SetNull({ payload: null, entity: "paymentDetails" }) }
  }, [])

  // set response to Table rows
  useEffect(() => {
    setData({
      ...data,
      rows: metaData.map((item, index) => {
        item['index'] = index + 1
        item['method'] = commonMethods.ConvertToCamelCase(item.method)
        item['description'] = item.description ? commonMethods.ConvertToCamelCase(item.description) : '-'
        item['action'] = item.is_payment_by_admin === 0 ? props.t("Received") : item.event_name.toLocaleLowerCase() === "refund" ? props.t("Refunded") : props.t("Paid")
        item['transaction_auth'] = item.is_payment_by_admin === 1 ?
          item.event_name.toLocaleLowerCase() === "refund" && provider_data ?
            props.t("Me to ") + Data.requester_first_name + " " + Data.requester_last_name :
            props.t("Me to ") + item.first_name + ' ' + item.last_name :
          commonMethods.ConvertToCamelCase(Data.requester_first_name + " " + Data.requester_last_name) + " to me"
        item['transaction_date'] = moment(parseInt(item.createdAt)).format('MMM DD, YYYY')
        item['amount_received'] = item.is_payment_by_admin === 0 ? "$" + parseFloat(item.total_amount).toFixed(2) : "-"
        item['amount_paid'] = item.is_payment_by_admin === 1 ? "$" + parseFloat(item.total_amount).toFixed(2) : "-"
        item['transaction_id'] = item.transaction_id || '-'
        item['temp_status'] = <span className={item.status === "failed" ? 'color-red' : 'color-green'}>{props.t(commonMethods.ConvertToCamelCase(item.status))}</span>
        return item
      }),
    })
  }, [metaData]);
  // success message if payment done
  useEffect(() => {
    if (props.JobPayment) {
      props.actions.setredux(props.JobPayment.message, "success_message", actionTypes.SUCCESS_MESSAGE)
    }
  }, [props.JobPayment])

  const PaymentorRefundHandler = () => {
    let dialog_amount = document.getElementById("amount").value;
    if (parseFloat(dialog_amount) > 0) {
      if (parseFloat(dialog_amount) > parseFloat(payableAmount)) {
        props.actions.setredux(props.t("You can not pay amount greater than payable amount"), 'error_message', actionTypes.ERROR_MESSAGE)
      } else {
        if (providerType !== null) {
          let is_payable = true;
          if (confirmPayment.task === "pay" && parseFloat(dialog_amount) > parseFloat(payableAmount)) {
            is_payable = false;
            setConfirmPayment({ ...confirmPayment, amount: dialog_amount })
          }
          if (is_payable) {
            setPayOrRefund(confirmPayment.task)
            props.actions.SetLoader(true)
          }
          setProviderType(null)
        } else {
          props.actions.setredux(props.t('Select one provider'), 'error_message', actionTypes.ERROR_MESSAGE)
        }
      }
    }
    else {
      props.actions.setredux(props.t('Amount can not be 0'), 'error_message', actionTypes.ERROR_MESSAGE)

    }
  }

  return (
    <>
      <div className="input-group Heading-Wrapper-container">
        <div className="form-outline Heading-Wrapper  search-wrapper">
          <img src={Back_arrow} alt="back_arrow" className="back-arrow"
            onClick={() => {
              props.actions.setredux(false, "paymentDetails")
            }}
          />
          <span className="details-text">{Data.job_title}</span>
        </div>
      </div>
      <div className="remove-border">
        <div className="order-detail-table-wrapper new-job-detail-table-wrapper">
          <div className="job-requester-details">
            <div className="ml-20 detail-wrapper">
              <div className="job-overview-wrapper">
                <div>
                  <RenderDetails label={props.t("Payment Mode")} value={<span style={{ color: props.paymentColorCode[0] }}>{props.paymentMode[0]}</span>} />
                  <RenderDetails label={props.t("Job Status")} value={
                    <span className={Data.job_status === 2 ? "color-green" : Data.job_status === 1 ? "color-red" : ""}>
                      {Data.job_status === 2 ?
                        props.t("Completed") :
                        Data.job_status === 1 ?
                          props.t("In progress") :
                          "-"
                      }
                    </span>
                  } />
                  <RenderDetails label={props.t("Recommended Rate")} value={Data.recommeded_rate || "-"} />
                  <div className="label">
                    <p className="job-detail-label-p ">{props.t("Payment Amount")}</p>
                    <div className="detail">: ${payableAmount}</div>
                    {payableAmount > 0 &&
                      <div className="p-r w-13p">
                        <span className="w-100p cur-point" onClick={() =>
                          setConfirmPayment({ visibility: true, task: 'pay', amount: '' })
                        }>{props.t("Pay Now")}</span>
                      </div>
                    }
                  </div>
                  <RenderDetails label={props.t("Paid Amount")} value={"$" + Data.send_payment || "$0"} />
                  <RenderDetails label={props.t("Commission Amount")} value={"$" + parseFloat(Data.recommended_rate * Data.commision_rate / 100).toFixed(2) || "$0"} />
                  <RenderDetails label={props.t("Commission Rate")} value={(Data.commision_rate || "0") + "%"} />
                  <RenderDetails label={props.t("Job Duration")} value={moment(new Date(Data.job_start_date)).format('MMM DD, YYYY') + " to " + moment(new Date(Data.job_completion_date)).format('MMM DD, YYYY')} />
                  <RenderDetails label={props.t("Requester Name")} value={commonMethods.ConvertToCamelCase((Data.requester_first_name + " " + Data.requester_last_name) || "-") || "-"} />
                  <RenderDetails label={props.t("Provider Name")} value={`${Data.provider_personal_detail.map((x) => x.first_name + ' ' + x.last_name)}`} />
                  <RenderDetails label={props.t("Provider's Contact Details")} value={`E - ${Data.provider_personal_detail.map((x) => x.email + '  ' + ' M ' + '-' + ' ' + x.phone_no + ' ')}`} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="input-group mt-13 ">
          <div className="Heading-Wrapper payment-detail-heading">
            <span className="details-text user-detail-heading">{props.t("Payment History")}</span>
          </div>
        </div>
        <div className="user-wrapper payment-detail-wrapper">
          <div className="customer-support-table-wrapper-new mt-40">
            <MDBDataTable
              noBottomColumns={true}
              info={false}
              responsive
              bordered
              sortable={false}
              data={data}
              options={{ search: false }}
              searching={false}
              hover
              noRecordsFoundLabel={<div className="no-data-found ta-l">{props.t("No payment details found!")}</div>}
              paginationLabel={[<MDBIcon icon="angle-left" size="sm" />, <MDBIcon icon="angle-right" size="sm" />,]}
              entriesOptions={props.entryOptions}
              displayEntries={false}
            />
          </div>
        </div>
      </div>

      {confirmPayment.visibility &&
        <div id="create-course-form" className="needs-validation">
          <SweetAlert
            onCancel={() => setConfirmPayment({ visibility: false, task: '', amount: 0 })}
            customButtons={
              <div>
                <Button className="cancel-button mr-4" onClick={() => {
                  setConfirmPayment({ visibility: false, task: '', amount: 0 })
                }}>{props.t("No")}</Button>
                <Button className="add-button" onClick={PaymentorRefundHandler}>{props.t("Pay")}</Button>
              </div>}>
            <AvForm>

              <span className="product-delete sf-pro-text" style={{fontSize:"18px"}}>
                {props.t("Are you sure you want to ")} {confirmPayment.task} ${payableAmount}? <br />

              </span>
              <div className="sweet-alert">
                <div className="form-wrapper">
                  <span className="sweet-label">{props.t("Payment amount*")}</span>
                  <AvField type="number" className="input" name="amount" id="amount"
                    value={props.fromrefundPage ? confirmPayment.amount : confirmPayment.task === "pay" ? confirmPayment.amount : 0}
                    onChange={(e) => setConfirmPayment({ ...confirmPayment, amount: e.target.value })}
                    placeholder={props.t("Enter amount")}
                  />

                  <AvRadioGroup name="providerName" style={{ textAlign: 'left' }} errorMessage={props.t("Please pick one")} required>
                    {primary_provider.length > 0 && <div><span className="sweet-label">{props.t("Primary Provider")}</span><br />&nbsp;
                      {primary_provider.map((x) => (
                        <AvRadio
                          label={(x.first_name + ' ' + x.last_name)}
                          onChange={(e) => { setProviderName(e.target.value); setProviderType(0) }}
                          value={x.provider_id}
                          checked={providerName === x.provider_id}
                        />
                      ))}
                      &nbsp;
                    </div>}

                    {new_backup_provider.length > 0 && <div><label className="sweet-label">{props.t("Backup Provider")}</label><br />&nbsp;
                      {new_backup_provider.map((x) => (
                        <AvRadio
                          label={(x.first_name + ' ' + x.last_name)}
                          onChange={(e) => { setProviderName(e.target.value); setProviderType(1) }}
                          value={x.provider_id}
                          checked={providerName === x.provider_id}

                        />
                      ))}
                      &nbsp;
                    </div>}
                  </AvRadioGroup>
                </div>
              </div>
            </AvForm>
          </SweetAlert>
        </div>

      }

      {
        payOrRefund &&
        <div className="paypal_payment">
          <PaypalPayment
            data={{
              "provider_id": Number(providerType === 0 ? provider_data : provider_data),
              "job_id": Data.job_id,
              "transaction_id": Data.transaction_id,
              "destinationId_backup": Data.backup_provider_personal_detail.filter((x) => (x.provider_id) === Number(provider_data)).map((x) => x.stripeConnectedAccountId).toString(),
              "destinationId_provider": Data.provider_personal_detail.filter((x) => (x.provider_id) === Number(provider_data)).map((x) => x.stripeConnectedAccountId).toString(),
              "amount_paid": Data.amount_paid,
              "amount_received": Data.amount_received,
              "is_backup_provider": Number(providerType),
              "provider_name": Data.provider_personal_detail.map((x) => x.first_name + ' ' + x.last_name).toString(),
              "backup_provider_name": Data.backup_provider_personal_detail.map((x) => x.first_name + ' ' + x.last_name).toString()
            }}
            amount={document.getElementById("amount").value}
            actions={props.actions}
            is_partial={confirmPayment.amount > document.getElementById("amount").value ? 1 : 0}
            SuccessPayment={() => {
              setPayOrRefund('')
              setConfirmPayment({ ...confirmPayment, visibility: false })
              document.getElementById("amount").value = temp_ampunt
            }}
            requester_id={payOrRefund !== "pay" ? Data.requester_id : ''}
            task={payOrRefund}
          />
        </div>
      }
    </>
  );
}

const mapStateToProps = ({ crud, layout }) => {
  return { ...crud, ...layout }
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Object.assign({}, crudAction, commonActions), dispatch),
});
export default withNamespaces()(connect(mapStateToProps, mapDispatchToProps)(PaymentDetails));
