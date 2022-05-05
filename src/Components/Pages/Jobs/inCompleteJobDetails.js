import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { Button } from "reactstrap";
import { bindActionCreators } from "redux";
import { crudAction } from "../../../Store/Actions";
import { connect } from "react-redux";
import { MDBDataTable, MDBIcon } from "mdbreact";
import { withNamespaces } from "react-i18next";
import { AvForm, AvField, AvRadioGroup, AvRadio } from "availity-reactstrap-validation";
import { DeletePopup } from "../../../Assets/Images/web";
import PaypalPayment from './paypalPayment'
import { commonMethods, commonActions } from '../../../Utils'
import { RenderDetails } from '../IPSUsers/UserDetails'
import { Back_arrow } from "../../../Assets/Images/web";
import * as actionTypes from '../../../Common/actionTypes'
import { useLocation } from 'react-router-dom'
import SentIcon from '@material-ui/icons/CallMade';
import ReceivedIcon from '@material-ui/icons/CallReceived';
import eye from '../../../Assets/Images/web/info.svg';
import SweetAlert from "react-bootstrap-sweetalert";
import closeIcon from "../../../Assets/Images/web/remove-toggle.svg";

function IncompleteJobDetails(props) {
const { Data, metaData } = props
  const { jobdetails, PaymentMode, PaymentColorCode, StatusColorCode, Status } = props
  let totalPayableAmount = jobdetails.recommended_rate;
  const providerPayAmount = jobdetails.job_requests.map((x) => x.recommended_rate);
  const [data, setData] = useState({ PaymentHistory: { columns: [], rows: [] } });
  const [proData, setProData] = useState({ ProviderDetails: { columns: [], rows: [] } });
  const [clockData, setClockData] = useState({ ClockDetails: { columns: [], rows: [] } });
  const [timeSheetData, setTimeSheetData] = useState({ Providers: { columns: [], rows: [] } });
  const [confirmPayment, setConfirmPayment] = useState({ visibility: false, task: '', amount: 0 })
  const [confirm_both, setconfirm_both] = useState(false);
  const [payOrRefund, setPayOrRefund] = useState("");
  const [paymentData, setPaymentData] = useState({})
  const [providerName, setProviderName] = useState("");
  const provider_data = String(providerName).split(' ').map(Number)
  const [providerType, setProviderType] = useState(null)

  const [infoDialog, setInfoDialog] = useState(null);
  let pay_type = confirmPayment.task === "pay";
  let refundData = {
    "provider_id": jobdetails.user_id,
    "job_id": jobdetails.id,
    "transaction_id": jobdetails.job_payments_data.map((x) => x.transaction_id),
    "destinationId_backup": jobdetails.job_requests.filter((x) => x.is_backup_provider === 0 && (x.provider_id) === Number(provider_data)).map((x) => x.stripeConnectedAccountId).toString(),
    "destinationId_provider": jobdetails.job_requests.filter((x) => x.is_backup_provider === 1 && (x.provider_id) === Number(provider_data)).map((x) => x.stripeConnectedAccountId).toString(),
    "amount_paid": jobdetails.job_payments_data.map((x) => x.amount_paid),
    "amount_received": jobdetails.job_payments_data.map((x) => x.amount_received),
    "is_backup_provider": Number(providerType),
    "provider_name": jobdetails.job_requests.map((x) => x.is_backup_provider === 0 && x.first_name + ' ' + x.last_name),
    "backup_provider_name": jobdetails.job_requests.map((x) => x.is_backup_provider === 0 && x.first_name + ' ' + x.last_name)
  }


  const location = useLocation();
  const Primary_provider = jobdetails.job_requests.filter((x) => x.is_backup_provider === 0 && (x.status === 4 || x.status === 1)).map((x) => x.provider_id);
  const Backup_provider = jobdetails.job_requests.filter((x) => x.is_backup_provider === 1 && (x.status === 4 || x.status === 1));
  const provider = jobdetails.job_requests.find(item => {
    return item.is_assigned === 1
  }) || {}
  let temp_ampunt = 0;
  let payableAmount = jobdetails.job_payments_data.map(item => {
    return item.topay = item.is_payment_by_admin === 1 && item.status.toLocaleLowerCase() === "success" ?
      { paid: true, amount: item.total_amount } : { paid: false, amount: 0 }
  })

  let paid_amount = 0, refunded_amount = 0;

  jobdetails.job_payments_data.forEach(item => {
    if (item.status.toLocaleLowerCase() === "success" && item.is_payment_by_admin === 1 && item.event_name.toLocaleLowerCase() !== "refund") {
      paid_amount += item.total_amount
    }
  })

  jobdetails.job_payments_data.forEach(item => {
    if (item.status.toLocaleLowerCase() === "success" && item.is_payment_by_admin === 1 && item.event_name.toLocaleLowerCase() === "refund") {
      refunded_amount += item.total_amount
    }
  })

  payableAmount.forEach(item => {
    return item.paid ? totalPayableAmount -= item.amount : totalPayableAmount += item.amount
  })

  totalPayableAmount = parseFloat(jobdetails.commision_rate ? totalPayableAmount - jobdetails.recommended_rate * jobdetails.commision_rate / 100 : totalPayableAmount).toFixed(2)
  totalPayableAmount = totalPayableAmount > 0 ? totalPayableAmount : 0

  const PaymentHandler = () => {
    var dialog_amount = parseFloat(document.getElementById("amount").value)
    if (parseFloat(dialog_amount) > 0) {
      if (parseFloat(dialog_amount) > parseFloat(paymentData.amount)) {
        props.actions.setredux("You can not pay amount greater than payable amount", 'error_message', actionTypes.ERROR_MESSAGE)
      }
      else {
              let is_payable = true;
        if (confirmPayment.task === "pay" && providerType && parseFloat(dialog_amount) > parseFloat(paymentData.amount)) {
          is_payable = false;
          setConfirmPayment({ ...confirmPayment, amount: dialog_amount })
          setProviderType(providerType)
        }
        if (is_payable) {
          setPayOrRefund(confirmPayment.task)
          setProviderType(providerType)
          props.actions.SetLoader(true)
        }
      }
    }
    else {
      props.actions.setredux('Amount can not be 0', 'error_message', actionTypes.ERROR_MESSAGE)
    }
  }

  const PaymentorRefundHandler = () => {
    let dialog_amount = document.getElementById("amount").value;
    if (parseFloat(dialog_amount) > 0) {
      let is_payable = true;
      if (confirmPayment.task === "pay" && parseFloat(dialog_amount) > parseFloat(totalPayableAmount)) {
        is_payable = false;
        props.actions.setredux(props.t("You can not pay amount greater than payable amount"), 'error_message', actionTypes.ERROR_MESSAGE)
        setConfirmPayment({ ...confirmPayment, amount: dialog_amount })
      }
      else if (confirmPayment.task !== "pay") {
        if (jobdetails.amount_to_refund) {
          if (parseFloat(dialog_amount) > parseFloat(jobdetails.amount_to_refund)) {
            is_payable = false;
            props.actions.setredux(props.t("You can not refund amount greater than refundable amount"), 'error_message', actionTypes.ERROR_MESSAGE)
            setConfirmPayment({ ...confirmPayment, amount: dialog_amount })
          }
        }
        else {
          if (parseFloat(dialog_amount) > parseFloat(totalPayableAmount)) {
            is_payable = false;
            props.actions.setredux(props.t("You can not refund amount greater than refundable amount"), 'error_message', actionTypes.ERROR_MESSAGE)
            setConfirmPayment({ ...confirmPayment, amount: dialog_amount })
          }
        }
      }
      if (is_payable) {
        setPayOrRefund(confirmPayment.task)
        props.actions.SetLoader(true)
      }
    }
    else {
      props.actions.setredux(props.t('Amount can not be 0'), 'error_message', actionTypes.ERROR_MESSAGE)
    }
  }

  // set Rows
  useEffect(() => {
    setData({
      PaymentHistory: {
        ...data.PaymentHistory,
        rows: jobdetails.job_payments_data.map((item, index) => {
          item['index'] = index + 1
          item['description'] = item.description ? commonMethods.ConvertToCamelCase(item.description) : '-'
          item['transaction_auth'] = item.is_payment_by_admin === 1 ?
            item.event_name.toLocaleLowerCase() === "refund" && provider_data ?
              props.t("Me to ") + item.first_name + " " + item.last_name :
              props.t("Me to ") + item.first_name + " " + item.last_name :
            commonMethods.ConvertToCamelCase(jobdetails.requester_first_name + " " + jobdetails.requester_last_name) + " to me"
          item['transaction_date'] = moment(parseInt(item.createdAt)).format('MMM DD, YYYY')
          item['amount_received'] = item.is_payment_by_admin === 0 ? "$" + parseFloat(item.total_amount).toFixed(2) : "-"
          item['amount_paid'] = item.is_payment_by_admin === 1 ? "$" + parseFloat(item.total_amount).toFixed(2) : "-"
          // item['temp_status'] = item.status
          item['pay_status'] = <span className={String(item.status).toLocaleLowerCase() === "success" ? "color-green" : "color-red"}>{commonMethods.ConvertToCamelCase(item.status)}</span>
          item['action'] = item.is_payment_by_admin === 0 ? props.t("Received") : item.event_name.toLocaleLowerCase() === "refund" ? props.t("Refunded") : props.t("Paid")

          return item
        })
      }
    })


    setProData({
      ProviderDetails: {
        ...proData.ProviderDetails,
        rows: jobdetails.job_requests.map((item, index) => {
          item['index'] = index + 1
          item['pro_name'] = commonMethods.ConvertToCamelCase(item.first_name + " " + item.last_name)
          item['pay_amt'] = item.recommended_rate === "NaN" ? "$"+ 0:"$"+ item.recommended_rate  || '-'
          item['current_status'] = <span style={{ color: StatusColorCode[item.status] }}>{props.t(Status[item.status])}</span>
          item['provider_type'] = (item.is_backup_provider === 0 ? 'Primary Provider' : 'Backup Provider')
          item['info'] = <div className="d-flex product-action-wrapper">
            <commonMethods.ActionProvider src={eye} id="View" onClick={() => setInfoDialog(item)} />
          </div>
          item['payment'] = item.recommended_rate > 1 && <button className="btn-pay btn btn-secondary" onClick={() => {
            setConfirmPayment({ visibility: true, task: 'pay', amount: '',name:item.pro_name });
            setPaymentData({
              "index": item.index,
              "provider_id": item.provider_id,
              "job_id": item.job_id,
              "destinationId_backup": item.stripeConnectedAccountId,
              "destinationId_provider": item.stripeConnectedAccountId,
              "name": item.pro_name,
              "amount": item.recommended_rate
            })
          }}>{props.t("Pay Now")}</button> || '-'
          return item
        })
      }
    })
    setClockData({
      ClockDetails: {
        ...clockData.ClockDetails,
        rows: jobdetails.job_requests.filter((x) => x?.is_backup_provider === 1 && x?.clock_in_clock_out_data?.length > 0 ).map((item, index) => {
          item['index1'] = index + 1
          item['back_name'] = (item?.clock_in_clock_out_data.length > 0 &&  item?.first_name + " " + item?.last_name) || "-"
          item['in_time'] = item?.clock_in_clock_out_data.map((x) =>  moment(x.clock_in_time, ["HH:mm:ss"]).format("hh:mm A"))|| "-"
          item['out_time'] = item?.clock_in_clock_out_data.map((x) =>  moment(x.clock_out_time, ["HH:mm:ss"]).format("hh:mm A"))|| "-"
          item['total_time'] = item?.clock_in_clock_out_data.map((x) => x.worked_hours) || "-"
          item['in_date'] = item?.clock_in_clock_out_data.map((x) => moment(x.clock_in_date).format('MMMM DD,YYYY')) || "-"
          item['out_date'] = item?.clock_in_clock_out_data.map((x) => moment(x.clock_out_date).format('MMMM DD,YYYY')) || "-"
          item['location'] = item?.clock_in_clock_out_data.map((x) => x.current_location) || "-"
          return item
        })
      }
    })
  }, [props.t, props.jobdetails])


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


  // set column name
  useEffect(() => {

    setData({
      PaymentHistory: {
        ...data.PaymentHistory,
        columns: [
          { label: props.t("No"), field: "index", sort: 'disabled' },
          { label: props.t("Transaction"), field: "transaction_auth", sort: 'disabled' },
          { label: props.t("Platform"), field: "method", sort: 'disabled' },
          { label: props.t("Action"), field: "action", sort: 'disabled' },
          { label: props.t("Amount Received"), field: "amount_received", sort: 'disabled' },
          { label: props.t("Amount Paid"), field: "amount_paid", sort: 'disabled' },
          { label: props.t("Transaction Date"), field: "transaction_date", sort: 'disabled' },
          { label: props.t("Invoice No"), field: "invoice_no", sort: 'disabled' },
          { label: props.t("Transaction Id"), field: "transaction_id", sort: 'disabled' },
          { label: props.t("Status"), field: "pay_status", sort: 'disabled' },
        ]
      },
    })

    setProData({
      ProviderDetails: {
        ...proData.ProviderDetails,
        columns: [
          { label: props.t("No"), field: "index", sort: 'disabled' },
          { label: props.t("Provider Name"), field: "pro_name", sort: 'disabled' },
          { label: props.t("Payable Amount"), field: "pay_amt", sort: 'disabled' },
          { label: props.t("Status"), field: 'current_status', sort: 'disabled' },
          { label: props.t("Provider Type"), field: "provider_type", sort: 'disabled' },
          { label: props.t("Information"), field: 'info' },
          ...(location.pathname === "/inprogress-jobs" && totalPayableAmount > 0 ? [{ label: props.t("Payment"), field: 'payment', sort: 'disabled' }] : []),
        ]
      }
    })

    setClockData({
      ClockDetails: {
        ...clockData.ClockDetails,
        columns: [
          { label: props.t("No"), field: "index1", sort: 'disabled' },
          { label: props.t("Backup Provider Name"), field: "back_name", sort: 'disabled' },
          { label: props.t("Clock-in Time"), field: "in_time", sort: 'disabled' },
          { label: props.t("Clock-out Time"), field: 'out_time', sort: 'disabled' },
          { label: props.t("Total Time"), field: 'total_time', sort: 'disabled' },
          { label: props.t("Clock-in Date"), field: 'in_date', sort: 'disabled' },
          { label: props.t("Clock-out Date"), field: 'out_date', sort: 'disabled' },
        ]
      }
    })

  }, [])

  return (
    <>
      {/* Header */}
      <div className="input-group Heading-Wrapper-container support-discussion">
        <div className="form-outline Heading-Wrapper w-100p">
          <img src={Back_arrow} alt="back_arrow" className="back-arrow" onClick={props.onClose} />
          <span className="details-text">{commonMethods.ConvertToCamelCase(jobdetails.title || "-")}</span>
          {
            location.pathname !== "/dispute" && totalPayableAmount > 0 &&
            <button className="btn-save add_button_new" onClick={() => {
              setConfirmPayment({ visibility: true, task: 'refund', amount: jobdetails.amount_to_refund })
            }}>{props.t("Refund")}</button>
          }

        </div>
      </div>

      {/* Content */}
      <div className="order-detail-table-wrapper remove-border new-job-detail-table-wrapper">
        <div className="job-requester-details">
          <div className="ml-20 detail-wrapper">
            <div className="job-overview-wrapper">
              <div className="mt-13">
                <RenderDetails label={props.t("Job Description")} value={commonMethods.ConvertToCamelCase(jobdetails.description) || '-'} />
                <RenderDetails label={props.t("Requester Name")} value={commonMethods.ConvertToCamelCase(jobdetails.requester_first_name + " " + jobdetails.requester_last_name) || '-'} />
                <RenderDetails label={props.t("Requester's Contact Details")} value={`E - ${jobdetails.requester_email} / M - ${jobdetails.requester_mobile_no}` || '-'} />
                <RenderDetails label={props.t("Provider Name")} value={`${jobdetails.job_requests.filter((x) => x.is_backup_provider === 0 && (x.status === 4 || x.status === 1)).map(x => x.pro_name)}` || '-'} />
                <RenderDetails label={props.t("Provider's Contact Details")} value={`${jobdetails.job_requests.filter((x) => x.is_backup_provider === 0 && (x.status === 4 || x.status === 1)).map(x => ' E - ' + x.email + ' ' + " M - " +x.phone_no)}` || '-'} />
                <RenderDetails label={props.t("Payment Mode")} value={<span style={{ color: PaymentColorCode[jobdetails.payment_mode] }}> {props.t(PaymentMode[jobdetails.payment_mode])}</span>} />
                <RenderDetails label={props.t("Recommended Rate")} value={`$${(jobdetails.recommended_rate).toFixed(2)}` || '-'} />
                {!props.fromrefundPage && <RenderDetails label={props.t("Payable Amount")} value={
                  <div className="d-flex">
                    <div className="detail">${totalPayableAmount}</div>
                    {totalPayableAmount > 0 &&
                      <div className="p-r">
                      </div>
                    }
                  </div>
                } />
                }
                <RenderDetails label={props.t("Paid Amount")} value={`$${(paid_amount).toFixed(2)}` || '-'} />
                {props.fromrefundPage && <RenderDetails label={props.t("Refundable Amount")} value={`$${jobdetails.amount_to_refund}` || '-'} />}
                {refunded_amount > 0 && <RenderDetails label={props.t("Refunded Amount")} value={`$${(refunded_amount).toFixed(2)}` || '-'} />}
                <RenderDetails label={props.t("Commissioned Amount")} value={`$${(jobdetails.recommended_rate * jobdetails.commision_rate / 100).toFixed(2)}` || '-'} />
                <RenderDetails label={props.t("Commission Rate")} value={(jobdetails.commision_rate || "0") + "%"} />
                <RenderDetails label={props.t("Work Duration")} value={moment(jobdetails.start_date).format('MMM DD, YYYY') + " to " + moment(jobdetails.end_date).format('MMM DD, YYYY') || '-'}  />
                <RenderDetails label={props.t("Expertise Required")} value={
                  jobdetails.job_expertises ?
                    jobdetails.job_expertises.map((item, index) => {
                      return item.title + (index + 1 === jobdetails.job_expertises.length ? " " : ", ")
                    })
                    : "-"
                }
                />
                <RenderDetails label={props.t("Address")} value={`${jobdetails.street_address}, ${jobdetails.city} - ${jobdetails.zipcode}, ${jobdetails.state}` || '-'} />
                <RenderDetails label={props.t("Job Location")} value={jobdetails.location || '-'} />
                <>
                  <div className="needs-validation">
                    {confirm_both ? (
                      <commonMethods.RenderSweetAlert
                        onCancel={() => setconfirm_both(false)}
                        CustomButton={
                          <>
                            <Button className="cancel-button mr-4" onClick={() => { setconfirm_both(false); }}>{props.t("No")}</Button>
                            <Button className="add-button" onClick={() => {
                              const payload = {
                                "type": "deleteProduct",
                                "product_id": confirm_both.id
                              }
                              // ProductDeleteHandler(payload)
                            }}>{props.t("Yes")}</Button>
                          </>
                        }
                        Body={() => (
                          <>
                            <img className="delete-product-image" src={DeletePopup} alt="delete-product" />
                            <div className="product-delete-heading">
                              <span>{props.t("Delete Job Requester")}</span>
                            </div>
                            <div className="product-delete-text-wrapper">
                              <span className="product-delete ">
                                {props.t("Are you sure you want")} <br /> {props.t("to delete this job from job request?")}
                              </span>
                            </div>
                          </>
                        )}
                      />
                    ) : null}
                  </div>
                  {/* <h3>Job Requests</h3> */}

                  {infoDialog && (
                    <commonMethods.RenderSweetAlert
                      onCancel={() => setInfoDialog(false)}
                      Body={() =>
                        <>
                        <div className="boxInfo">

                          <p style={{ fontSize:"22px" }}>
                            Job Requests Information
                          </p>

                          <br />
                          <table className="table">
                          <tbody className="p-r tl-left">
                            <tr>
                              <td>
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
                      }

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
                            style={{ height: "100%", width: '20px' }}
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


        {/* Job Request Table */}
        <p className="job-detail-table-name Heading-Wrapper">{props.t("Job Requests")}</p>
        <div className="customer-support-table-wrapper-new mt-40 space-between">
          <MDBDataTable
            noBottomColumns={true}
            noRecordsFoundLabel={<div className="no-data-found ta-l">{props.t("No job requests found!")}</div>}
            paginationLabel={[
              <MDBIcon icon="angle-left" size="sm" />,
              <MDBIcon icon="angle-right" size="sm" />,
            ]}
            info={false}
            responsive
            bordered
            data={proData.ProviderDetails}
            searching={false}
            displayEntries={false}
          />
        </div>

        {/* clock-in clock-out Table */}

        <p className="job-detail-table-name Heading-Wrapper">{props.t("Clock-in & Clock-out")}</p>
        <div className="customer-support-table-wrapper-new mt-40 space-between">
          <MDBDataTable
            noBottomColumns={true}
            noRecordsFoundLabel={<div className="no-data-found ta-l">{props.t("No clock-in clock-out data found!")}</div>}
            paginationLabel={[
              <MDBIcon icon="angle-left" size="sm" />,
              <MDBIcon icon="angle-right" size="sm" />,
            ]}
            info={false}
            responsive
            bordered
            data={clockData.ClockDetails}
            searching={false}
            displayEntries={false}
          />
        </div>

       {/*TimeSheet Data*/}

        <p className="job-detail-table-name Heading-Wrapper">{props.t("TimeSheet")}</p>
        <div className="customer-support-table-wrapper-new mt-40 space-between">
          <MDBDataTable
            noBottomColumns={true}
            noRecordsFoundLabel={<div className="no-data-found ta-l">{props.t("No timeSheet data found!")}</div>}
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

        {/* Payment History Table */}
        <p className="job-detail-table-name Heading-Wrapper">{props.t("Payment History")}</p>
        <div className="customer-support-table-wrapper-new mt-40 space-between">
          <MDBDataTable
            noBottomColumns={true}
            noRecordsFoundLabel={<div className="no-data-found ta-l">{props.t("No payment history found!")}</div>}
            paginationLabel={[
              <MDBIcon icon="angle-left" size="sm" />,
              <MDBIcon icon="angle-right" size="sm" />,
            ]}
            info={false}
            responsive
            bordered
            data={data.PaymentHistory}
            searching={false}
            displayEntries={false}
          />
        </div>
      </div>
      {/* Confirmation Dialog */}

      {confirmPayment.visibility &&
        <div id="create-course-form" className="needs-validation">
          <SweetAlert
            onCancel={() => setConfirmPayment({ visibility: false, task: '', amount: 0 })}
            customButtons={
              <div>
                <Button className="cancel-button mr-4" onClick={() => {
                  setConfirmPayment({ visibility: false, task: '', amount: 0 })
                  setProviderName('')
                }}>{props.t("No")}</Button>
                {confirmPayment.task === "pay" ? <Button className="add-button" onClick={PaymentHandler}>{props.t("Pay")}</Button> :
                  <Button className="add-button" onClick={PaymentorRefundHandler}>{props.t("Refund")}</Button>}
              </div>}>
            <AvForm>

              <span className="product-delete sf-pro-text font-size-17" style={{ color: 'black' }}>
                {confirmPayment.task === "pay" ? <>{props.t("Are you sure you want to ")} {confirmPayment.task} {confirmPayment.name}? </>
                  : <>{props.t("You can refund to") + " " + (jobdetails.requester_first_name + " " + jobdetails.requester_last_name)}? </>}
                {/* : <>{props.t("You can refund to up") + " $" + (totalPayableAmount) + " " + "to " + (jobdetails.requester_first_name + " " + jobdetails.requester_last_name)}? </>} */}

              </span>

              <div className="sweet-alert">
                <div className="form-wrapper">
                  <span className="sweet-label">{props.t(`${confirmPayment.task == "pay" ? "Payable" : "Refundable"} amount*`)}</span>
                  <AvField type="number" className="input" name="amount" id="amount"
                    value={props.fromrefundPage ? confirmPayment.amount : confirmPayment.task === "pay" ? confirmPayment.amount : 0}
                    onChange={(e) => setConfirmPayment({ ...confirmPayment, amount: e.target.value })}
                    placeholder={props.t("Enter amount")}
                  />
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
            data={pay_type ? paymentData : refundData}
            amount={document.getElementById("amount").value}
            is_partial={parseFloat(totalPayableAmount) > parseFloat(document.getElementById("amount").value) ? 1 : 0}
            actions={props.actions}
            SuccessPayment={() => {
              setPayOrRefund('')
              setConfirmPayment({ visibility: false, task: '', amount: 0 })
              document.getElementById("amount").value = temp_ampunt
            }}
            requester_id={payOrRefund !== "pay" ? jobdetails.user_id : ''}
            task={payOrRefund}
            JobRefund={props.JobRefund}
          />
        </div>
      }
    </>
  )
}
const mapStateToProps = ({ crud, layout }) => {
  return { ...crud, ...layout }
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Object.assign({}, crudAction, commonActions), dispatch),
});
export default withNamespaces()(connect(mapStateToProps, mapDispatchToProps)(IncompleteJobDetails))
