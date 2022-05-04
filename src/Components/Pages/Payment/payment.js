import moment from 'moment'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withNamespaces } from "react-i18next";
import { MDBDataTable, MDBIcon } from "mdbreact";
import React, { useState, useEffect } from 'react'

import PaymentDetails from './paymentDetails'
import * as entity from '../../../Common/entity'
import { crudAction } from "../../../Store/Actions";
import JobDetails from '../Jobs/inCompleteJobDetails';
import { commonMethods, commonActions } from "../../../Utils";

function PaymentTable(props) {
  let paymentRef, refundRef;
  const [data, setData] = useState({ Payment: { columns: [], rows: [] }, Refund: { columns: [], rows: [] } });
  const [paymentSection, setPaymentSection] = useState(true)

  // API calls
  useEffect(() => {
    if (!props.JobPayment) {
      if (paymentSection) {
        const payload = {
          "type": "getDuePaymentHistoryAdmin"
        }
        props.actions.postAll(entity.GetAllJobPostAdmin, payload, "getAllDuePayment")
      }
      else {
        const payload = { "type": "getAllJobPostAdmin" }
        props.actions.postAll(entity.GetAllJobPostAdmin, payload, "getAllRefundData")
      }
    }
    return () => props.actions.SetNull({ payload: null, entity: "JobPayment" })
  }, [props.JobPayment, paymentSection])

  // Payment history - set rows and paymentDetails for payment listing
  useEffect(() => {
    if (props.getAllDuePayment) {
      setData({
        ...data,
        Payment: {
          ...data.Payment,
          rows: props.getAllDuePayment.data.final_dispay_data.map((item, index) => {
            item['index'] = index + 1;
            item["r_full_name"] = commonMethods.ConvertToCamelCase(item.requester_first_name + " " + item.requester_last_name)
            item['title'] = commonMethods.ConvertToCamelCase(item.job_title)
            item["date"] = item.last_payment_date ? moment(new Date(parseInt(item.last_payment_date))).format('MMM DD, YYYY') : moment(new Date(parseInt(item.payment_received_date))).format('MMM DD, YYYY')
            item["view_detail"] = <a href onClick={() => {
              props.actions.setredux(item, "paymentDetails")
            }
            }>{props.t("View Details")}</a>
            item['recommeded_rate'] = "$" + parseFloat(item.recommended_rate).toFixed(2)
            item['amount_received'] = "$" + parseFloat(item.received_payment).toFixed(2)
            item['amount_paid'] = "$" + parseFloat(item.send_payment).toFixed(2)
            return item
          })
        }
      })
    }
    if (props.paymentDetails && props.getAllDuePayment) {
      props.actions.setredux({}, "paymentDetails")
      const data = props.getAllDuePayment.data.final_dispay_data.find(item => {
        return item.job_id === props.paymentDetails.job_id
      })
      props.actions.setredux(data, "paymentDetails")
    }
  }, [props.getAllDuePayment, props.t])

  // Refund payments - set rows and jobDetailsVisibility for payment listing
  useEffect(() => {
    if (props.getAllRefundData) {
      setData({
        ...data,
        Refund: {
          ...data.Refund,
          rows: props.getAllRefundData.data.refund_job_data.map((item, index) => {
            const Date1 = commonMethods.getSortedDate(item.job_schedule_time)
            item['index'] = index + 1;
            item["r_full_name"] = commonMethods.ConvertToCamelCase(item.requester_first_name + " " + item.requester_last_name)
            item['title'] = commonMethods.ConvertToCamelCase(item.title)
            item['date'] = moment(Date1[0]).format('MMM DD, YYYY') + props.t(" to ") + moment(Date1[Date1.length - 1]).format('MMM DD, YYYY')
            item['recommeded_rate'] = "$" + parseFloat(item.recommended_rate).toFixed(2)
            item['amount_received'] = "$" + parseFloat(item.amount_received).toFixed(2)
            item['amount_refunded'] = "$" + parseFloat(item.amount_refunded).toFixed(2)
            item["view_detail"] = <a href onClick={() => {
              props.actions.setredux(item, "jobDetailsVisibility")
            }
            }>{props.t("View Details")}</a>
            return item
          })
        }
      })
    }
    if (props.jobDetailsVisibility && props.getAllRefundData) {
      props.actions.setredux({}, "jobDetailsVisibility")
      const data = props.getAllRefundData.data.refund_job_data.find(item => {
        return item.id === props.jobDetailsVisibility.id
      })
      props.actions.setredux(data, "jobDetailsVisibility")
    }
  }, [props.getAllRefundData, props.t])

  // set columns for payments and refund
  useEffect(() => {
    setData({
      ...data,
      Payment: {
        ...data.Payment,
        columns: [
          { label: props.t('ID'), field: 'index' },
          { label: props.t('Job Title'), field: 'title' },
          { label: props.t('Requester'), field: 'r_full_name' },
          { label: props.t('Recommended Rate'), field: 'recommeded_rate', sort: 'disabled' },
          { label: props.t('Amount Received'), field: 'amount_received', sort: 'disabled' },
          { label: props.t('Amount Paid'), field: 'amount_paid', sort: 'disabled' },
          { label: props.t('Amount Date'), field: 'date' },
          { label: 'Action', field: 'view_detail' , sort: "disabled",}
        ]
      },
      Refund: {
        ...data.Refund,
        columns: [
          { label: props.t('ID'), field: 'index' },
          { label: props.t('Job Title'), field: 'title' },
          { label: props.t('Requester'), field: 'r_full_name' },
          { label: props.t('Recommended Rate'), field: 'recommeded_rate', },
          { label: props.t('Amount Received'), field: 'amount_received', },
          { label: props.t('Amount Refunded'), field: 'amount_refunded', },
          { label: props.t('Job Duration'), field: 'date' },
          { label: 'Action', field: 'view_detail', sort: "disabled", }
        ]
      }
    })
  }, [props.t])

  return (
    <>
      {
        (!props.paymentDetails && !props.jobDetailsVisibility) &&
        <>
          {/* Header */}
          <div className="input-group Heading-Wrapper-container">
            <div className="Heading-Wrapper">
              <span className={`customer-support-text cur-point section-text-${paymentSection}`} style={{ color: !paymentSection && "#B4BAC1" }} onClick={() => {
                if (refundRef) {
                  refundRef.state.search = ""
                }
                setPaymentSection(true)
              }}>
                {props.t("Payment")}
              </span>
              <span className={`customer-support-text cur-point section-text-${!paymentSection}`} style={{ color: paymentSection && "#B4BAC1" }} onClick={() => {
                if (paymentRef) {
                  paymentRef.state.search = ""
                }
                setPaymentSection(false)
              }}>
                {props.t("Refund")}
              </span>
            </div>
          </div>

          {/* Search */}
          <div className="input-group serach-wrapper-container category-search mt-3">
            <div className="form-outline search-wrapper col-md-8 ml-4">
            </div>
          </div>

          <div className="customer-support-table-wrapper-new common-wrapper p-r new-jobs-table-wrapper order-table payment-table">
            {
              paymentSection ?
                <MDBDataTable
                  ref={ele => paymentRef = ele}
                  noBottomColumns={true}
                  noRecordsFoundLabel={<div className="no-data-found">{props.t('No payments found!')}</div>}
                  paginationLabel={[<MDBIcon icon="angle-left" size="lg" />, <MDBIcon icon="angle-right" size="lg" />,]}
                  info={false}
                  responsive
                  bordered1
                  data={data.Payment}
                  small
                  hover
                  entriesOptions={props.entryOptions}
                  displayEntries={true}
                />
                :
                <MDBDataTable
                  ref={ele => refundRef = ele}
                  noBottomColumns={true}
                  noRecordsFoundLabel={<div className="no-data-found">{props.t('No refund data found!')}</div>}
                  paginationLabel={[<MDBIcon icon="angle-left" size="lg" />, <MDBIcon icon="angle-right" size="lg" />,]}
                  info={false}
                  responsive
                  bordered
                  data={data.Refund}
                  small
                  hover
                  entriesOptions={props.entryOptions}
                  displayEntries={true}
                />
            }
            <br/>
            {
              paymentSection ?<span>Showing 1 to 10 of {data.Payment.rows.length} entries.</span>  : <span>Showing 1 to 10 of {data.Refund.rows.length} entries.</span>
            }
 </div>
        </>
      }
      {/* Payment details */}
      {
        props.paymentDetails &&
        <PaymentDetails
          Data={props.paymentDetails}
          metaData={props.paymentDetails.payment_history_data}
        />
      }

      {/* Refund details */}
      {props.jobDetailsVisibility &&
        <JobDetails
          jobdetails={props.jobDetailsVisibility}
          onClose={() => { props.actions.setredux(false, "jobDetailsVisibility") }}
          PaymentMode={props.paymentMode}
          Status={props.status}
          actions={props.actions}
          fromrefundPage={true}
          StatusColorCode={props.statusColorCode}
          PaymentColorCode={props.paymentColorCode}
          props={props}
        />
      }
      <br/>

    </>
  )
}

const mapStateToProps = ({ crud, layout }) => {
  return { ...crud, ...layout }
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Object.assign({}, crudAction, commonActions), dispatch),
});

export default withNamespaces()(connect(mapStateToProps, mapDispatchToProps)(PaymentTable));
