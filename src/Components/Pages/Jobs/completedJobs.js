import moment from 'moment';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withNamespaces } from "react-i18next";
import { MDBDataTable, MDBIcon } from "mdbreact";
import React, { useState, useEffect } from 'react'
// import { Search } from "../../../Assets/Images/web";

import JobDetails from './inCompleteJobDetails';
import * as entity from '../../../Common/entity';
import { crudAction } from '../../../Store/Actions';
import { SUCCESS_MESSAGE } from '../../../Common/actionTypes';
import { commonActions, commonMethods } from '../../../Utils';

function CompleteJobs(props) {

  const [data, setData] = useState({ columns: [], rows: [] })
  const jobPaymentArray = [...props.paymentMode, props.t("All Records")]
  const [drop_align, setdrop_align] = useState(false);
  const [paymentTypeDropDown, setPaymentTypeDropdown] = useState(jobPaymentArray[0]);

  // Api call to get Jobs
  useEffect(() => {
    if (!props.JobPayment) {
      const payload = {
        type: "getAllJobPostAdmin",
        payment_type: jobPaymentArray.indexOf(paymentTypeDropDown)
      }
      props.actions.postAll(entity.GetAllJobPostAdmin, payload, "GetAllJobPostAdmin")
    }

    // to make redux variable null
    return () => {
      props.actions.SetNull({ payload: null, entity: "GetAllJobPostAdmin" })
      props.actions.SetNull({ payload: null, entity: "JobPayment" })
    }
  }, [paymentTypeDropDown, props.JobPayment])


  // set Rows and jobDetailsVisibility
  useEffect(() => {
    if (props.GetAllJobPostAdmin) {
      setData({
        ...data,
        rows: props.GetAllJobPostAdmin.data.complete_job_data.map((item, index) => {
          const provider = item.job_requests.find(item => {
            return item.is_assigned === 1
          })
          const Date1 = commonMethods.getSortedDate(item.job_schedule_time)
          item['index'] = index + 1
          item["requester_name"] = commonMethods.ConvertToCamelCase(item.requester_first_name + " " + item.requester_last_name)
          // item['assignee'] = provider ? commonMethods.ConvertToCamelCase(provider.first_name + " " + provider.last_name) : '-'
          item['comp_name'] = commonMethods.ConvertToCamelCase(item.comp_name || "-")
          item['sort_payment'] = props.t(props.paymentMode[item.payment_mode])
          item['temp_payment_type'] = <p className="ml-4" style={{ color: props.paymentColorCode[item.payment_mode] }} >
            {props.t(props.paymentMode[item.payment_mode])}
          </p>
          item["view_detail"] = <a href onClick={() => props.actions.setredux(item, "jobDetailsVisibility")}>{props.t("View Details")}</a>
          item["date"] = moment(Date1[0]).format('MMM DD, YYYY') + props.t(" to ") + moment(Date1[Date1.length - 1]).format('MMM DD, YYYY')
          return item
        })
      })
    }
    else {
      setData({
        ...data,
        rows: []
      })
    }
    if (props.jobDetailsVisibility && props.GetAllJobPostAdmin) {
      props.actions.setredux({}, "jobDetailsVisibility")
      const data = props.GetAllJobPostAdmin.data.complete_job_data.find(item => {
        return item.id === props.jobDetailsVisibility.id
      })
      props.actions.setredux(data, "jobDetailsVisibility")
    }
  }, [props.GetAllJobPostAdmin, props.t])

  // set Columns
  useEffect(() => {

    const columns = [
      { label: props.t('No'), field: 'index', sort: 'disabled' },
      { label: props.t('Job Title'), field: 'title', sort: 'disabled' },
      { label: props.t('Requester'), field: 'requester_name', sort: 'disabled' },
      // { label: props.t('Provider'), field: 'assignee', sort: 'disabled' },
      { label: props.t('Company Name'), field: 'comp_name', sort: 'disabled' },
      { label: props.t('Duration'), field: 'date', sort: 'disabled' },
      { label: 'Action', field: 'view_detail', sort: 'disabled' }
    ]
    if (jobPaymentArray.indexOf(paymentTypeDropDown) === 2) {
      const temp_column = columns.splice(2)
      setData({
        ...data,
        columns: [...columns, { label: props.t('Payment Type'), field: 'temp_payment_type', sort: 'disabled' }, ...temp_column]
      })
    }
    else {
      setData({
        ...data,
        columns: columns
      })
    }
  }, [paymentTypeDropDown, props.t])

  // Invoke after successfully received response from backend
  useEffect(() => {
    props.JobPayment && props.actions.setredux("Payment successful", 'success_message', SUCCESS_MESSAGE)
  }, [props.JobPayment])

  return (
    <>
      {/* jobs table */}
      {!props.jobDetailsVisibility &&
        <>
          <div className="input-group serach-wrapper-container">
            <div className="form-outline search-wrapper col-md-8">
              {/* <input type="text" className="form-control search" autoComplete="off" /> */}
              {/* <img src={Search} className="search-image" alt={props.t("Search")} /> */}
            </div>
          </div>
          <div className="customer-support-table-wrapper-new common-wrapper p-r new-jobs-table-wrapper order-table">
            <MDBDataTable
              info={false}
              responsive
              bordered
              data={data}
              hover
              entriesOptions={props.entryOptions}
              displayEntries={true}
              noBottomColumns={true}
              paginationLabel={[<MDBIcon icon="angle-left" size="sm" />, <MDBIcon icon="angle-right" size="sm" />,]}
              noRecordsFoundLabel={<div className="no-data-found ta-l">{props.t("No complete jobs found!")}</div>}
            />
            Showing 1 to 10 of {data.rows.length} entries.

          </div>
        </>
      }

      {/* Job details */}
      {props.jobDetailsVisibility &&
        <JobDetails
          jobdetails={props.jobDetailsVisibility}
          onClose={() => {
            props.actions.setredux(false, "jobDetailsVisibility")
          }}
          PaymentMode={props.paymentMode}
          Status={props.status}
          StatusColorCode={props.statusColorCode}
          PaymentColorCode={props.paymentColorCode}
          actions={props.actions}
          jobCompleted={true}
          props={props}
        />

      }
      <br/>

    </>
  )
}

const mapStateToProps = ({ crud, layout }) => {
  return { ...crud, ...layout }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Object.assign({}, crudAction, commonActions), dispatch),
});

export default withNamespaces()(connect(mapStateToProps, mapDispatchToProps)(CompleteJobs))
