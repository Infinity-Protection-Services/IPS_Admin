import moment from 'moment'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withNamespaces } from "react-i18next";
import { MDBDataTable, MDBIcon } from "mdbreact";
import React, { useState, useEffect } from "react";

import * as entity from '../../../Common/entity'
import SupportDiscussion from './supportDiscussion';
// import { Search } from "../../../Assets/Images/web";
import { crudAction } from "../../../Store/Actions";
import * as actionTypes from '../../../Common/actionTypes';
import { commonMethods, commonActions } from "../../../Utils";
import { storageUtils } from '../../../Utils'

function DisputeRequest(props) {

  const disputeArray = [props.t('Pending'), props.t('Resolved'), props.t('All Records')]
  const getSupportOrDispute = storageUtils.getSupportOrDispute()
  const [drop_align, setdrop_align] = useState(false);

  const [disputeDropdown, setDisputeDropdown] = useState(disputeArray[0]);
  const [data, setData] = useState({ DispueTable: { columns: [], rows: [] } });


  useEffect(() => {
    setData({
      DispueTable: {
        ...data.DispueTable,
        columns: [
          { label: props.t("Dispute ID"), field: "index", },
          { label: props.t("User Type"), field: "user_type" },
          { label: props.t("User Name"), field: "user_name", },
          { label: props.t("Status"), field: "status", },
          { label: props.t("Received Date"), field: "received_date", },
          { label: props.t("Action"), field: "view_details", sort: "disabled", },
        ]
      }
    })
    props.actions.SetNull({ type: actionTypes.SUCCESS_MESSAGE, entity: "success_message" });
  }, [props.t])

  useEffect(() => {
    if (!props.supportDetailVisibility) {
      const a = disputeArray.indexOf(disputeDropdown);
      const payload = {
        "type": "getAllDisputesAdmin",
        "status": a > 0 ? a + 1 : a
      }

      // to prevent displaying loader when coming back from conversation page
      if (props.backOnQueryTable) {
        props.actions.postAll(entity.GetAllDisputesAdmin, payload, "GetAllDispute", false, false)
        props.actions.SetNull({ type: actionTypes.FETCH, entity: "backOnQueryTable" });
      }
      else {
        props.actions.postAll(entity.GetAllDisputesAdmin, payload, "GetAllDispute")
      }

    }
  }, [disputeDropdown, props.supportDetailVisibility])

  // set dispute table rows
  useEffect(() => {
    if (props.GetAllDispute) {
      if (props.GetAllDispute.data) {

        let data1;

        setData({
          ...data,
          DispueTable: {
            ...data.DispueTable,
            rows: props.GetAllDispute.data.map((item, index) => {

              if (getSupportOrDispute && getSupportOrDispute.id === item.id) {
                data1 = item
              }

              item.index = <span>
                {item.unreadMessages > 0 ? <span class="dot"></span> : <span class="dot mr-13" style={{ display: 'initial' }}></span>}
                {index + 1}
              </span>
              item.user_type = commonMethods.ConvertToCamelCase(item.user_type)
              item.user_name = item.first_name + " " + item.last_name || ""
              item.status_temp = item.status === 2 ? 1 : item.status
              item.status = item.status === 0 ? disputeArray[0] : item.status === 1 ? '' : item.status === 2 ? disputeArray[1] : ''
              item.received_date = moment(item.createdAt).format('MMM DD, YYYY');
              item.view_details = <a href onClick={() => {
                storageUtils.setSupportOrDispute({ id: item.id, type: "dispute" })
                props.actions.setredux(item, "supportDetailVisibility")
                // 13/7
                props.actions.SetNull({ payload: null, entity: "JobPayment" })
              }
              } style={{ textDecoration: 'underline', color: '#0d5ea4' }}>{props.t("View Details")}</a>
              return item
            })
          }
        })

        if (storageUtils.getSupportOrDispute()) {
          props.actions.setredux(data1, "supportDetailVisibility")
        }
      }
      else {
        setData({
          ...data,
          DispueTable: {
            ...data.DispueTable,
            rows: []
          }
        })
      }
    }
  }, [props.GetAllDispute])

  useEffect(() => {
    if (props.Solved) {
      props.actions.setredux(props.Solved.message, 'success_message', actionTypes.SUCCESS_MESSAGE)
      props.actions.setredux(false, "supportDetailVisibility")
    }
  }, [props.Solved])

  return (
    <>
      {!props.supportDetailVisibility &&
        <>

          {/* common search bar */}
          <div className="input-group serach-wrapper-container category-search mt-3">
            <div className="form-outline search-wrapper col-md-6 ml-4" style={{ minWidth: '100px' }}>
              {/* <input type="text" placeholder={props.t("Search Category Here")} className="form-control search" autoComplete="off" /> */}
              {/* <img src={Search} alt="search" className="search-image" /> */}
            </div>
          </div>



          {/* Dispute table */}
          {
            <div className="customer-support-table-wrapper-new common-wrapper order-table p-r user-table-wrapper">
              <div className={`col-md-${props.isMobile ? 12 : 12}`}>
                <MDBDataTable
                  noBottomColumns={true}
                  noRecordsFoundLabel={<div className="no-data-found">{props.t("No dispute requests found!")}</div>}
                  paginationLabel={[
                    <MDBIcon icon="angle-left" size="sm" />,
                    <MDBIcon icon="angle-right" size="sm" />,
                  ]}
                  info={false}
                  responsive
                  bordered
                  paging={true}
                  data={data.DispueTable}
                  orderable={false}
                  entriesOptions={props.entryOptions}
                  displayEntries={true}
                />
                <br/>
            Showing 1 to 10 of {data.DispueTable.rows.length} entries.
              </div>
              <commonMethods.DropDown
                open={drop_align}
                onClose={() => setdrop_align(!drop_align)}
                pa="p-a drop-new-r-0 customer-support-dropdown-new"
                options={disputeArray.map(item => {
                  return { key: item }
                })}
                onSelect={(id) => { setDisputeDropdown(id); }}
                selected={disputeDropdown}
              />
            </div>
          }
        </>
      }

      {/* Chat screen */}
      {
        props.supportDetailVisibility &&
        <SupportDiscussion
          data={props.supportDetailVisibility}
          heading={props.t("Dispute Request")}
          t={props.t}
          isDispute={true}
          onClose={() => {
            storageUtils.removeSupportorDispute()
            props.actions.setredux(false, "supportDetailVisibility");
          }}
          actions={props.actions}
        />
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

export default withNamespaces()(connect(mapStateToProps, mapDispatchToProps)(DisputeRequest));
