import moment from 'moment';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withNamespaces } from "react-i18next";
import { MDBDataTable, MDBIcon } from "mdbreact";
import React, { useState, useEffect } from 'react'
import PaypalPayment from './paypalPayment'
import JobDetails from './inCompleteJobDetails';
import * as entity from '../../../Common/entity';
import { crudAction } from '../../../Store/Actions';
import { commonActions, commonMethods } from '../../../Utils';
import EditJobDetail from './EditJobDetail';

function InCompleteJobs(props) {
  const [data, setData] = useState({ columns: [], rows: [] })
  const jobPaymentArray = [...props.paymentMode, props.t("All Records")]
  const [paymentTypeDropDown, setPaymentTypeDropdown] = useState(jobPaymentArray[0]);

  // Api call to get Jobs
  useEffect(() => {
    if (!props.JobPayment) {
      const payload1 = {
        type: "getAllJobPostAdmin",
        payment_type: jobPaymentArray.indexOf(paymentTypeDropDown),
        // provider_id:
      }

      props.actions.postAll(entity.GetAllJobPostAdmin, payload1, "GetAllJobPostAdmin")

    }
  }, [paymentTypeDropDown, props.JobPayment])

  useEffect(() => {
    // to make redux vriable null
    // props.actions.SetLoader(true);
    return () => {
      props.actions.SetNull({ payload: null, entity: "GetAllJobPostAdmin" })
      props.actions.SetNull({ payload: null, entity: "JobPayment" })
      props.actions.SetNull({ payload: null, entity: "EditJob" })
    }
  }, [props.JobPayment])

  // set Rows
  useEffect(() => {
    // props.actions.SetLoader(true);
    if (props.GetAllJobPostAdmin) {
      if (props.GetAllJobPostAdmin.data.inprocess_job_data) {
        setData({
          ...data,
          rows: props.GetAllJobPostAdmin.data.inprocess_job_data.map((item, index) => {
            const provider = item.job_requests.find(item => {
              return item.is_assigned === 1
            })
            const Date1 = commonMethods.getSortedDate(item.job_schedule_time)
            item['index'] = index + 1
            item["requester_name"] = commonMethods.ConvertToCamelCase(item.requester_first_name + " " + item.requester_last_name)
            // item['assignee'] = provider ? commonMethods.ConvertToCamelCase(provider.first_name + " " + provider.last_name) : "-"
            item['comp_name'] = commonMethods.ConvertToCamelCase(item.comp_name || "-")
            item['sort_payment'] = props.t(props.paymentMode[item.payment_mode])
            item['temp_payment_type'] = <p className="ml-4" style={{ color: props.paymentColorCode[item.payment_mode] }} >
              {props.t(props.paymentMode[item.payment_mode])}
            </p>
            item["Edit"] = <a style={{ color: '#0d5ea4', textDecoration: 'underline' }} href onClick={() => props.actions.setredux(item, "EditJob")}>{props.t("Edit")}</a>

            item["view_detail"] = <a href onClick={() => {
              props.actions.setredux(item, "jobDetailsVisibility")
            }
            }>{props.t("View Details")}</a>
            item["date"] = moment(item.start_date).format('MMM DD, YYYY') + props.t(" to ") + moment(item.end_date).format('MMM DD, YYYY')
            return item
          }).sort(function (x, y) { return (new Date(y["start_date"]).getTime()) - (new Date(x["end_date"]).getTime()) })
        })
        // props.actions.SetLoader(false);
      }
      else {
        setData({
          ...data,
          rows: []
        })
      }
    }
    else {
      setData({
        ...data,
        rows: []
      })
    }
    if (props.jobDetailsVisibility && props.GetAllJobPostAdmin) {
      props.actions.setredux({}, "jobDetailsVisibility")
      const data = props.GetAllJobPostAdmin.data.inprocess_job_data.find(item => {
        return item.id === props.jobDetailsVisibility.id
      })
      props.actions.setredux(data, "jobDetailsVisibility")
    }
  }, [props.GetAllJobPostAdmin, props.t])

  // set Columns
  useEffect(() => {
    const columns = [
      { label: props.t('No'), field: 'index' },
      { label: props.t('Job Title'), field: 'title' },
      { label: props.t('Requester'), field: 'requester_name' },
      // { label: props.t('Provider'), field: 'assignee' },
      { label: props.t('Company Name'), field: 'comp_name' },
      { label: props.t('Duration'), field: 'date' },
      { label: 'Action', field: 'Edit', sort: "disabled", sort: 'disabled' },
      { label: props.t(''), field: 'view_detail', sort: "disabled", sort: 'disabled' }
    ]
    if (jobPaymentArray.indexOf(paymentTypeDropDown) === 0) {
      const temp_column = columns.splice(2)
      setData({
        ...data,
        columns: [...columns, { label: props.t('Payment Type'), field: 'temp_payment_type' }, ...temp_column]
      })
    }
    else {
      setData({
        ...data,
        columns: columns
      })
    }
  }, [paymentTypeDropDown, props.t])

  return (
    <>
      {(!props.jobDetailsVisibility && !props.EditJob) &&
        <>
          {/* header */}
          <div className="input-group serach-wrapper-container">
            <div className="form-outline search-wrapper col-md-8">
              {/* <input type="text" className="form-control search" autoComplete="off" /> */}
              {/* <img src={Search} className="search-image" alt={props.t("Search")} /> */}
            </div>
          </div>

          {/* jobs table */}
          <div className="customer-support-table-wrapper-new common-wrapper p-r new-jobs-table-wrapper order-table">
            <MDBDataTable
              noBottomColumns={true}
              noRecordsFoundLabel={<div className="no-data-found ta-l">{props.t("No in-progress jobs found!")}</div>}
              paginationLabel={[<MDBIcon icon="angle-left" size="sm" />, <MDBIcon icon="angle-right" size="sm" />,]}
              info={false}
              responsive
              bordered
              data={data}
              hover
              entriesOptions={props.entryOptions}
              displayEntries={true}
            />
            <br/>
              Showing 1 to 10 of {data.rows.length} entries.
            {/* <commonMethods.DropDown
              open={drop_align}
              onClose={() => setdrop_align(!drop_align)}
              pa="p-a r-0 job-filter"
              options={jobPaymentArray.map(item => {
                return { key: item }
              })}
              onSelect={(id) => { setPaymentTypeDropdown(id); }}
              selected={paymentTypeDropDown}
            /> */}
          </div>
        </>
      }

      {/* job details */}
      {props.jobDetailsVisibility &&
        <JobDetails
          jobdetails={props.jobDetailsVisibility}
          onClose={() => {
            props.actions.setredux(false, "jobDetailsVisibility")
          }}
          PaymentMode={props.paymentMode}
          Status={props.status}
          actions={props.actions}
          StatusColorCode={props.statusColorCode}
          PaymentColorCode={props.paymentColorCode}
          props={props}
        />
      }
      {props?.EditJob &&
        <EditJobDetail
          editjob={props.EditJob}
          t={props.t}
          isFrom="In-Progress Job"
          onClose={() => {
            props.actions.setredux(false, "EditJob")
          }}
        />
      }

    </>
  )
}

const mapStateToProps = ({ crud, layout }) => {
  return { ...crud, ...layout }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Object.assign({}, crudAction, commonActions), dispatch),
});

export default withNamespaces()(connect(mapStateToProps, mapDispatchToProps)(InCompleteJobs))
