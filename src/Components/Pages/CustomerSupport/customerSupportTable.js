import moment from 'moment';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withNamespaces } from "react-i18next";
import { MDBDataTable, MDBIcon } from "mdbreact";
import React, { useState, useEffect } from "react";

import { storageUtils } from '../../../Utils';
import * as entity from '../../../Common/entity';
import SupportDiscussion from './supportDiscussion';
// import { Search } from "../../../Assets/Images/web";
import { crudAction } from "../../../Store/Actions";
import * as actionTypes from '../../../Common/actionTypes';
import { commonMethods, commonActions } from "../../../Utils";

function CustomerSupportTable(props) {

  const getSupportOrDispute = storageUtils.getSupportOrDispute()
  const supportArray = [props.t('Pending'), props.t('Resolved'), props.t('All Records')]

  const [drop_align, setdrop_align] = useState(false);
  const [supportDropdown, setSupportDropdown] = useState(supportArray[0]);
  const [data, setData] = useState({ SupportTable: { columns: [], rows: [] } });

  // set columns
  useEffect(() => {
    setData({
      ...data,
      SupportTable: {
        ...data.SupportTable,
        columns: [
          { label: props.t("Incident ID"), field: "index", },
          { label: props.t("User Type"), field: "user_type", },
          { label: props.t("User Name"), field: "user_name", },
          { label: props.t("Status"), field: "status", },
          { label: props.t("Received Date"), field: "received_date", },
          { label: props.t("Action"), field: "view_details",  sort: "disabled",},
        ]
      }
    })

    props.actions.SetNull({ type: actionTypes.SUCCESS_MESSAGE, entity: "success_message" });
  }, [props.t])

  // API calls for support and dispute list
  useEffect(() => {
    if (!props.supportDetailVisibility) {
      const payload = {
        "type": "getAllCustomerSupport",
        "status": supportArray.indexOf(supportDropdown)
      }

      // to prevent displaying loader when coming back from conversation page
      if (props.backOnQueryTable) {
        props.actions.postAll(entity.GetAllCustomerSupport, payload, "GetAllCustomerSupport", false, false)
        props.actions.SetNull({ type: actionTypes.FETCH, entity: "backOnQueryTable" });
      }
      else {
        props.actions.postAll(entity.GetAllCustomerSupport, payload, "GetAllCustomerSupport")
      }
    }
  }, [supportDropdown, props.supportDetailVisibility])

  // set customer table rows
  useEffect(() => {
    if (props.GetAllCustomerSupport) {
      if (props.GetAllCustomerSupport.data) {

        let temp_data;

        setData({
          ...data,
          SupportTable: {
            ...data.SupportTable,
            rows: props.GetAllCustomerSupport.data.map((item, index) => {

              if (getSupportOrDispute && item.id === getSupportOrDispute.id) {
                temp_data = item
              }

              item.index = <span>
                {item.unreadMessages > 0 ? <span className="dot"></span> : <span class="dot mr-13" style={{ display: 'initial' }}></span>}
                {index + 1}
              </span>
              item.user_type = commonMethods.ConvertToCamelCase(item.user_type)
              item.user_name = item.first_name + " " + item.last_name || ""
              item.status_temp = item.status
              item.status = item.status === 0 ? supportArray[0] : item.status === 1 ? supportArray[1] : item.status === 2 ? supportArray[2] : ''
              item.received_date = moment(item.createdAt).format('MMM DD, YYYY');
              item.view_details = <a href
                onClick={() => {
                  storageUtils.setSupportOrDispute({ id: item.id, type: "support" })
                  props.actions.setredux(item, "supportDetailVisibility")
                }}
                style={{ textDecoration: 'underline', color: '#0d5ea4' }}
              >{props.t("View Details")}</a>
              return item
            })
          }
        })
        if (storageUtils.getSupportOrDispute()) {
          props.actions.setredux(temp_data, "supportDetailVisibility")
        }
      }
      else {
        setData({
          ...data,
          SupportTable: {
            ...data.SupportTable,
            rows: []
          }
        })
      }
    }
  }, [props.GetAllCustomerSupport])

  // set redux variable
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

          {/* Suppoprt table */}
          {
            <div className="customer-support-table-wrapper-new common-wrapper p-r new-jobs-table-wrapper order-table">
              <div className={`col-md-${props.isMobile ? 12 : 12}`} >
                <MDBDataTable
                  noBottomColumns={true}
                  noRecordsFoundLabel={<div className="no-data-found">{props.t("No support requests found!")}</div>}
                  paginationLabel={[
                    <MDBIcon icon="angle-left" size="sm" />,
                    <MDBIcon icon="angle-right" size="sm" />,
                  ]}
                  info={false}
                  responsive
                  bordered
                  data={data.SupportTable}
                  orderable={false}
                  paging={true}
                  entriesOptions={props.entryOptions}
                  displayEntries={true}
                />
<br/>
            Showing 1 to 10 of {data.SupportTable.rows.length} entries.

                <commonMethods.DropDown
                  open={drop_align}
                  onClose={() => setdrop_align(!drop_align)}
                  pa="p-a drop-new-r-0 customer-support-dropdown-new"
                  options={supportArray.map(item => { return { key: item } })}
                  onSelect={(id) => { setSupportDropdown(id); }}
                  selected={supportDropdown}
                />
              </div>

            </div>
          }
        </>
      }

      {/* Chat screen */}
      {
        props.supportDetailVisibility &&
        <SupportDiscussion
          data={props.supportDetailVisibility}
          heading={props.t("Support request")}
          t={props.t}
          onClose={() => {
            storageUtils.removeSupportorDispute()
            props.actions.setredux(false, "supportDetailVisibility");
          }}
          actions={props.actions}
        />
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

export default withNamespaces()(connect(mapStateToProps, mapDispatchToProps)(CustomerSupportTable));
