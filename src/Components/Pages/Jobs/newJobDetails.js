import { withNamespaces } from "react-i18next";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { MDBDataTable, MDBIcon } from "mdbreact";
import { crudAction } from "../../../Store/Actions";
import React, { useEffect, useState } from "react";
import { Button } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { commonMethods, commonActions } from "../../../Utils";
import SentIcon from "@material-ui/icons/CallMade";
import { RenderDetails } from "../IPSUsers/UserDetails";
import {
  Back_arrow,
  IconDelete,
  DeletePopup,
} from "../../../Assets/Images/web";
import ReceivedIcon from "@material-ui/icons/CallReceived";
import PaypalPayment from "./paypalPayment";
import moment from "moment";
import eye from "../../../Assets/Images/web/info.svg";
import closeIcon from "../../../Assets/Images/web/remove-toggle.svg";
import * as actionTypes from "../../../Common/actionTypes";
import { withRouter } from "react-router-dom";
import { cond } from "lodash-es";

function JobDetails(props) {
  const [confirm_both, setconfirm_both] = useState(false);
  const [infoDialog, setInfoDialog] = useState(null);
  const [confirmPayment, setConfirmPayment] = useState({
    visibility: false,
    task: "",
    amount: 0,
  });
  const [addBackupProvider, setBackupProvider] = useState({
    visibility: false,
    data: [],
  });
  const [payOrRefund, setPayOrRefund] = useState("");
  const [paymentData, setPaymentData] = useState({});
  const [data, setData] = useState({ Providers: { columns: [], rows: [] } });
  const [timeSheetData, setTimeSheetData] = useState({ Providers: { columns: [], rows: [] } });
  const { jobdetails, PaymentMode, Status, StatusColorCode, PaymentColorCode ,GetAllJobPostAdmin} =props;
  let totalPayableAmount = jobdetails.recommended_rate;
  const provider =
    jobdetails.job_requests.find((item) => {
      return item.is_assigned === 1;
    }) || {};

  let temp_ampunt = 0;
  const PaymentorRefundHandler = () => {
    var dialog_amount = parseFloat(document.getElementById("amount").value);
    if (dialog_amount > 0) {
      if (dialog_amount > parseFloat(totalPayableAmount)) {
        props.actions.setredux(
          "You can not pay amount greater than payable amount",
          "error_message",
          actionTypes.ERROR_MESSAGE
        );
        setConfirmPayment({ ...confirmPayment, amount: dialog_amount });
      } else {
        temp_ampunt = document.getElementById("amount").value;
        setPayOrRefund(confirmPayment.task);
        props.actions.SetLoader(true);
      }
    } else {
      props.actions.setredux(
        "Amount can not be 0",
        "error_message",
        actionTypes.ERROR_MESSAGE
      );
    }
  };

  // Rows
  useEffect(() => {
    setData({
      Providers: {
        ...data.Providers,
        rows: jobdetails.job_requests.map((item, index) => {
          item["id"] = index + 1;
          item["full_name"] = commonMethods.ConvertToCamelCase(
            item.first_name + " " + item.last_name
          );
          item["provider_type"] =
            item.is_backup_provider === 0
              ? "Primary Provider"
              : "Backup Provider";
          item["current_status"] = (
            <span style={{ color: StatusColorCode[item.status] }}>
              {props.t(Status[item.status])}
            </span>
          );
          item["info"] = (
            <div className="d-flex product-action-wrapper">
              <commonMethods.ActionProvider
                src={eye}
                id="View"
                onClick={() => setInfoDialog(item)}
              />
            </div>
          );
          item["payment"] = totalPayableAmount > 0 && (
            <button
              className="btn-pay"
              style={{
                height: "30px",
                width: "70px",
                marginRight: "100px",
                color: "white",
              }}
              onClick={() => {
                setConfirmPayment({
                  visibility: true,
                  task: "pay",
                  amount: totalPayableAmount,
                });
                setPaymentData({
                  provider_id: item.provider_id,
                  job_id: item.job_id,
                  destinationId_backup: item.stripeConnectedAccountId,
                  destinationId_provider: item.stripeConnectedAccountId,
                });
              }}
            >
              {" "}
              {props.t("Pay Now")}
            </button>
          );
          item["change_provider"] =
            item.is_backup_provider === 1 ? (
              <button
                className="btn-pay"
                style={{ height: "40px", width: "100px", color: "white" }}
              >
                {" "}
                {props.t("Change Backup Provider")}
              </button>
            ) : (
              <button
                className="btn-pay"
                style={{ height: "40px", width: "100px", color: "white" }}
              >
                {props.t("Change Primary Provider")}
              </button>
            );
          return item;
        }),
      },
    });
  }, [props.t]);
   // Column
   useEffect(() => {
    setData({
      Providers: {
        ...data.Providers,
        columns: [
          { label: props.t("No"), field: "id", sort: "disabled" },
          {label: props.t("Provider Name"),field: "full_name",sort: "disabled",},
          {label: props.t("Status"),field: "current_status",sort: "disabled",},
          {label: props.t("Provider Type"),field: "provider_type",sort: "disabled",},
          { label: props.t("Information"), field: "info", sort: "disabled" },
          ...(props.location.pathname === "/inprogress-jobs"? [{label: props.t("Payment"),field: "payment",sort: "disabled",},]
            : []),
        ],
      },
    });
  }, []);

let newData = props.jobdetails.job_requests.map((x) => x );
let newMultiple = props.jobdetails.job_multiple_dates.map((x) => x);
let mergedData = [];

let all_selected_box = {};
    newData.filter(x => x.box_id && x.box_id.length >0  && x.is_backup_provider === 0).forEach((x, index) => {
  x.box_id.forEach(box => {
      all_selected_box[box] = 1;
    let newRecord = x;
    newRecord.boxInfo = newMultiple.find(boxId => boxId.id === (box))
    mergedData.push({...newRecord});
  })
})
if(Object.keys(all_selected_box).map(x => Number(x)).length < newMultiple.length){
    newMultiple.filter(x => !Object.keys(all_selected_box).map(x => Number(x)).includes(x.id)).forEach(x => {
        let newRecord = {boxInfo: x};
        newRecord.fullName = "";
        mergedData.push({...newRecord});
    })
}

useEffect(() => {
  setTimeSheetData({
      Providers: {
        ...timeSheetData.Providers,
        rows: mergedData?.map((item, index) => {
          item["index"] = index + 1;
          item["full_name"] = item?.box_id?.length > 0 &&  item?.first_name +" "+item?.last_name || "-";
          item["start_date"] =moment(item?.boxInfo?.start_date, ["YYYY-MM-DD"]).format("MMM DD, YYYY")|| "-";
          item["end_date"] = moment(item?.boxInfo?.end_date,["YYYY-MM-DD"]).format("MMM DD, YYYY")|| "-";
          item["start_time"] =moment(item?.boxInfo?.start_time, ["HH:mm"]).format("hh:mm A")|| "-";
          item["end_time"] = moment(item?.boxInfo?.end_time, ["HH:mm"]).format("hh:mm A")|| "-";
          item["job_dates"] = `${item?.boxInfo?.job_dates.map(x => moment(x, ["YYYY-MM-DD"]).format("MMM DD, YYYY")).join(", ")}`|| "-";
          return item;
        }),
      },
    });
  }, [props.t]);


  useEffect(() => {
    setTimeSheetData({
      Providers: {
        ...timeSheetData.Providers,
        columns: [
          { label: props.t("No"), field: "index", sort: "disabled" },
          {label: props.t("Provider Name"),field: "full_name",sort: "disabled",},
          {label: props.t("Start Date"),field: "start_date",sort: "disabled",},
          {label: props.t("End Date"),field: "end_date",sort: "disabled",},
          {label: props.t("Start time"),field: "start_time",sort: "disabled",},
          {label: props.t("End time"),field: "end_time",sort: "disabled",},
          {label: props.t("Job Dates"),field: "job_dates",sort: "disabled",},

        ],
      },
    });
  }, []);

  useEffect(() => {
    return () => {
      props.actions.SetNull({ payload: null, entity: "paymentDetails" });
    };
  }, []);

  const handleSubmit = async (values) => {
    const CategoryList = jobdetails.job_requests.map((item) => {
      return item.type.toLowerCase();
    });
    const value = values;
    value.type = commonMethods.ConvertToCamelCase(value.type.trim());
    if (value.type) {
      if (!value.flag && CategoryList.includes(value.type.toLowerCase())) {
        if (
          !addBackupProvider.visibility ||
          (addBackupProvider.visibility &&
            commonMethods.ConvertToCamelCase(addBackupProvider.data?.type) !==
              commonMethods.ConvertToCamelCase(value.type) &&
            CategoryList.includes(value.type.toLowerCase()))
        ) {
          props.actions.setredux(
            "Category already exists!",
            "error_message",
            "ERROR_MESSAGE"
          );
        } else {
          document.getElementById("submit-button").disabled = true;
        }
        document.getElementById("type").value = value.type;
      } else {
        delete value["flag"];
      }
    }
  };
  return (
    <>
      {/* Header */}
      <div className="input-group Heading-Wrapper-container">
        <div className="form-outline Heading-Wrapper">
          <img
            src={Back_arrow}
            className="back-arrow"
            onClick={props.onClose}
            alt="back_arrow"
          />
          <span className="details-text">
            {commonMethods.ConvertToCamelCase(jobdetails.title) || '-'}
          </span>
        </div>
      </div>
      <div className="order-detail-table-wrapper remove-border new-job-detail-table-wrapper">
        <div className="job-requester-details">
          <div className="ml-20 detail-wrapper">
            <div className="job-overview-wrapper">
              <div className="mt-13 ">
                <RenderDetails
                  label={props.t("Requester Name")}
                  value={commonMethods.ConvertToCamelCase(jobdetails.full_name)|| '-'}
                />
                <RenderDetails
                  label={props.t("Requester's Contact Details")}
                  value={`E - ${jobdetails.requester_email} / M - ${jobdetails.requester_mobile_no}`|| '-'}
                />
                <RenderDetails
                  label={props.t("Job Description")}
                  value={commonMethods.ConvertToCamelCase(
                    jobdetails.description
                  )|| '-'}
                />
                <RenderDetails
                  label={props.t("Provider Name")}
                  value={
                    `${jobdetails.job_requests
                      .filter(
                        (x) =>
                          x.is_backup_provider === 0 &&
                          (x.status === 4 || x.status === 1)
                      )
                      .map((x) => x.full_name)}` || "-"
                  }
                />
                <RenderDetails
                  label={props.t("Provider's Contact Details")}
                  value={`${jobdetails.job_requests
                    .filter(
                      (x) =>
                        x.is_backup_provider === 0 &&
                        (x.status === 4 || x.status === 1)
                    )
                    .map(
                      (x) =>
                       "E - "+ x.email + " " + "M - " + " " + x.phone_no + "  "
                    )}`|| '-'}
                />
                <RenderDetails
                  label={props.t("Payment Mode")}
                  value={
                    <span
                      style={{
                        color: PaymentColorCode[jobdetails.payment_mode],
                      }}
                    >
                      {props.t(PaymentMode[jobdetails.payment_mode])}
                    </span>
                  || '-'}
                />
                <RenderDetails
                  label={props.t("Recommended Rate")}
                  value={`$${totalPayableAmount}`|| '-'}
                />
                <RenderDetails
                  label={props.t("Work Duration")}
                  value={
                    moment(jobdetails.start_date).format("MMM DD, YYYY") +
                    " to " +
                    moment(jobdetails.end_date).format("MMM DD, YYYY")
                    || '-'}
                />
                <RenderDetails
                  label={props.t("Expertise Required")}
                  value={
                    jobdetails.job_expertises
                      ? jobdetails.job_expertises.map((item, index) => {
                          return (
                            item.title +
                            (index + 1 === jobdetails.job_expertises.length
                              ? " "
                              : ", ")
                          );
                        })
                      : "-"
                  }
                />
                <RenderDetails
                  label={props.t("Job Location")}
                  value={`${commonMethods.ConvertToCamelCase(
                    jobdetails.street_address
                  )}, ${jobdetails.city} - ${jobdetails.zipcode}, ${
                    jobdetails.state
                  }`|| '-'}
                />
                <>
                  <div>
                    {confirm_both ? (
                      <commonMethods.RenderSweetAlert
                        onCancel={() => setconfirm_both(false)}
                        CustomButton={
                          <>
                            <Button
                              className="cancel-button mr-4"
                              onClick={() => {
                                setconfirm_both(false);
                              }}
                            >
                              {props.t("No")}
                            </Button>
                            <Button
                              className="add-button"
                              onClick={() => {
                                const payload = {
                                  type: "deleteProduct",
                                  product_id: confirm_both.id,
                                };
                              }}
                            >
                              {props.t("Yes")}
                            </Button>
                          </>
                        }
                        Body={() => (
                          <>
                            <img
                              className="delete-product-image"
                              src={DeletePopup}
                              alt="delete-product"
                            />
                            <div className="product-delete-heading">
                              <span>{props.t("Delete Provider")}</span>
                            </div>
                            <div className="product-delete-text-wrapper">
                              <span className="product-delete ">
                                {props.t("Are you sure you want")} <br />{" "}
                                {props.t(
                                  "to delete this provider from job request?"
                                )}
                              </span>
                            </div>
                          </>
                        )}
                      />
                    ) : null}
                  </div>
                  {confirmPayment.visibility && (
                    <commonMethods.RenderSweetAlert
                      onCancel={() =>
                        setConfirmPayment({
                          visibility: false,
                          task: "",
                          amount: 0,
                        })
                      }
                      CustomButton={
                        <>
                          <Button
                            className="cancel-button mr-4"
                            onClick={() => {
                              setConfirmPayment({
                                visibility: false,
                                task: "",
                                amount: 0,
                                name: "",
                              });
                            }}
                          >
                            {props.t("No")}
                          </Button>
                          <Button
                            className="add-button"
                            onClick={() => {
                              PaymentorRefundHandler();
                            }}
                          >
                            {props.t("Pay")}
                          </Button>
                        </>
                      }
                      Body={(renderProps) => (
                        <>
                          <AvForm
                            id="create-course-form"
                            className="needs-validation"
                          >
                            <div className="product-delete-text-wrapper">
                              <span
                                className="product-delete sf-pro-text font-size-17"
                                style={{ color: "black" }}
                              >
                                {confirmPayment.task === "pay" ? (
                                  <>
                                    {props.t("Are you sure you want to pay")}{" "}
                                    <br /> {props.t(" to ")}{" "}
                                  </>
                                ) : (
                                  <>
                                    {props.t("You can refund upto ") +
                                      "$" +
                                      (totalPayableAmount
                                        ? totalPayableAmount
                                        : totalPayableAmount) +
                                      props.t(" to ")}{" "}
                                  </>
                                )}
                                {confirmPayment.task === "pay" &&
                                  confirmPayment.name + "?"}
                              </span>
                            </div>
                            <div className="sweet-alert">
                              <div className="form-wrapper">
                                <span className="category">
                                  {props.t("Payment amount*")}
                                </span>
                                <AvField
                                  type="number"
                                  className="input"
                                  name="amount"
                                  id="amount"
                                  value={
                                    props.fromrefundPage
                                      ? confirmPayment.amount
                                      : confirmPayment.task === "pay"
                                      ? confirmPayment.amount
                                      : 0
                                  }
                                  onChange={setConfirmPayment(confirmPayment)}
                                  autoComplete="off"
                                  onKeyDown={renderProps.onEnterKeyDownConfirm}
                                  errorMessage={props.t("Please enter amount")}
                                  placeholder={props.t("Please enter amount")}
                                  validate={{ required: { value: true } }}
                                  min={0}
                                />
                              </div>
                            </div>
                          </AvForm>
                        </>
                      )}
                    />
                  )}

                  {infoDialog && (
                    <commonMethods.RenderSweetAlert
                      onCancel={() => setInfoDialog(false)}
                      Body={() => (
                        <>
                        <div className="boxInfo">

                          <p style={{ fontSize:"22px" }}>
                            Job Requests Information
                          </p>

                          <br />
                          <table className="table">
                          <tbody className="p-r tl-left">
                            <tr>
                              <td className="border-transparent">
                              {props.t("Address")} :
                              </td>
                              <td>
                              {infoDialog.address || "-"}
                              </td>

                            </tr>
                            <tr>
                              <td>
                              {props.t("Citizenship")} :
                              </td>
                              <td>
                              {infoDialog.citizenship || "-"}
                              </td>
                            </tr>

                            <tr>
                              <td>
                              {props.t("Invited / Received")} :
                              </td>
                              <td>
                              {infoDialog.is_req_send_by_requester === 1 ? (
                                <div className="d-flex h-15">
                                  <p>Invited</p>
                                  <SentIcon />
                                </div>
                              ) : infoDialog.is_req_send_by_provider === 1 ? (
                                <div className="d-flex h-15">
                                  <p>Received</p>
                                  <ReceivedIcon className="color-red" />
                                </div>
                              ) : (
                                ""
                              )}
                              </td>
                            </tr>
                            </tbody>
                          </table>
                          </div>
                        </>
                      )}
                      CustomButton={
                        <button
                          style={{
                            position: "absolute",
                            top: -16,
                            right: -15,
                            background: "transparent",
                            border: "none",
                            height: 25,
                            width: 25,
                          }}
                          onClick={() => setInfoDialog(false)}
                        >
                          <img
                            className="close-icon"
                            src={closeIcon}
                            alt="close icon"
                            style={{ height: "100%", width: "30px",marginTop:"30px",marginRight:"30px" }}
                          />
                        </button>
                      }
                    />
                  )}
                </>
              </div>
            </div>
          </div>
        </div>
        {/* Job request table */}
        <div>
          <p className="job-detail-table-name Heading-Wrapper">
            {props.t("Job Requests")}
          </p>
        </div>
        <div className="customer-support-table-wrapper-new mt-40">
          <MDBDataTable
            noBottomColumns={true}
            noRecordsFoundLabel={
              <div className="no-data-found ta-l">
                {props.t("No job requests found!")}
              </div>
            }
            paginationLabel={[
              <MDBIcon icon="angle-left" size="sm" />,
              <MDBIcon icon="angle-right" size="sm" />,
            ]}
            info={false}
            responsive
            bordered
            data={data.Providers}
            searching={false}
            displayEntries={false}
          />
        </div>


        <div>
          <p className="job-detail-table-name Heading-Wrapper">
            {props.t("TimeSheet")}
          </p>
        </div>
        <div className="customer-support-table-wrapper-new mt-40">
          <MDBDataTable
            noBottomColumns={true}
            noRecordsFoundLabel={
              <div className="no-data-found ta-l">
                {props.t("No timeSheet data found!")}
              </div>
            }
            paginationLabel={[
              <MDBIcon icon="angle-left" size="sm" />,
              <MDBIcon icon="angle-right" size="sm" />,
            ]}
            info={false}
            responsive
            bordered
            data={timeSheetData.Providers}
            searching={false}
            displayEntries={false}
          />
        </div>
      </div>
      {payOrRefund && (
        <div className="paypal_payment">
          <PaypalPayment
            data={paymentData}
            amount={document.getElementById("amount").value}
            is_partial={
              parseFloat(totalPayableAmount) >
              parseFloat(document.getElementById("amount").value)
                ? 1
                : 0
            }
            actions={props.actions}
            SuccessPayment={() => {
              setPayOrRefund("");
              setConfirmPayment({
                visibility: false,
                task: "",
                amount: 0,
                name: "",
              });
            }}
            requester_id={payOrRefund !== "pay" ? jobdetails.user_id : ""}
            task={payOrRefund}
            JobRefund={props.JobRefund}
          />
        </div>
      )}
    </>
  );
}
const mapStateToProps = ({ crud, layout }) => {
  return { ...crud, ...layout };
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    Object.assign({}, crudAction, commonActions),
    dispatch
  ),
});
export default withNamespaces()(
  connect(mapStateToProps, mapDispatchToProps)(withRouter(JobDetails))
);
