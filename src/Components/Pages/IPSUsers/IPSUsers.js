import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withNamespaces } from "react-i18next";
import { MDBDataTable, MDBIcon } from "mdbreact";
import React, { useState, useEffect } from "react";

import UserDetail from './UserDetails'
import { commonActions, commonMethods } from "../../../Utils";
import { crudAction } from "../../../Store/Actions";
import { GetAllUsers } from "../../../Common/entity";

function IPSUsers(props) {
  const UsersArray = [props.t("All Users"), props.t("Requester"), props.t("Provider")] //props.t("Admin"),
  const StatusArray = [props.t("Inactive"), props.t("Active")]
  const [data, setData] = useState({ columns: [], rows: [], });
  const [dropdown, setDropDown] = useState({ users: false, active: false });
  const [selectedDropdown, setSelectedDropDown] = useState({
    userDropdown: UsersArray[0],
    statusDropdown: StatusArray[1],
  });

  // Api call to get categories
  useEffect(() => {
    var type_index = UsersArray.indexOf(selectedDropdown.userDropdown);
    const payload = {
      "type": "getAllUsers",
      "user_type": type_index > 0 ? type_index + 1 : 0,
      "status": StatusArray.indexOf(selectedDropdown.statusDropdown),
    }
    props.actions.postAll(GetAllUsers, payload, "getAllUsers")
  }, [selectedDropdown])

  // set Table Column
  useEffect(() => {
    setData({
      ...data,
      columns: [
        { label: props.t("No"), field: "id" },
        { label: props.t("User Type"), field: "user_role_id", },
        { label: props.t("User Name"), field: "user_name", },
        { label: props.t("User Location"), field: "location", },
        { label: props.t("Status"), field: "status", },
        { label: 'Action', field: 'view_detail', sort: "disabled", sort: 'disabled' }
      ]
    })
  }, [props.t])

  // set response to Table rows
  useEffect(() => {
    if (props.getAllUsers) {
      if (props.getAllUsers.data) {
        setData({
          ...data,
          rows: props.getAllUsers.data.map((item,index) => {
            item['temp_role_id'] = item.user_role_id
            item['user_role_id'] = item.user_role_id == 1 ? props.t("Admin") : item.user_role_id == 2 ? props.t("Requester") : props.t("Provider")
            item['user_name'] = item.first_name + " " + item.last_name
            item['location'] = (item.city && item.state) ? item.city + ", " + item.state : "-"
            item['status'] = item.status === 0 ? props.t('Inactive') : item.status === 1 ? props.t('Active') : '-'
            item["view_detail"] = <a href onClick={() => props.actions.setredux(item, "userDetailVisibility")} style={{ textDecoration: 'underline', color: '#0d5ea4' }}>{props.t("View Details")}</a>
            return item;
          }),
        })
      }
      else {
        setData({ ...data, rows: [] })
      }
    }
  }, [props.getAllUsers]);

  return (
    <>
      {!props.userDetailVisibility &&
        <>
          <div className="user-wrapper">
            <div className="input-group serach-wrapper-container heading-wrapper-container">

              <div className="p-a">

                {/* hidden drop down */}
                <commonMethods.DropDown
                  open={dropdown.active}
                  onClose={() => { setDropDown({ active: !dropdown.active }); }}
                  h51="h-51"
                  responsive
                  style={{ visibility: 'hidden' }}
                  options={StatusArray.map(item => {
                    return { key: item }
                  })}
                  onSelect={(id) => { setSelectedDropDown({ ...selectedDropdown, statusDropdown: id }); }}
                  selected={selectedDropdown.statusDropdown}

                />

                {/* Users drop down */}

              </div>
            </div>

            {/* User table */}
            <div className="customer-support-table-wrapper-new common-wrapper order-table p-r user-table-wrapper">

              <MDBDataTable
                noBottomColumns={true}
                noRecordsFoundLabel={<div className="no-data-found ta-l">{props.t("No users found!")}</div>}
                paginationLabel={[<MDBIcon icon="angle-left" size="sm" />, <MDBIcon icon="angle-right" size="sm" />,]}
                info={false}
                entriesOptions={props.entryOptions}
                displayEntries={true}
                responsive
                bordered
                data={data}
                hover
                sort
              />
              <br/>
              Showing 1 to 10 of {data.rows.length} entries.
              <commonMethods.DropDown
                open={dropdown.users}
                onClose={() => { setDropDown({ users: !dropdown.users }); }}
                pa="p-a new-r-0 customer-support-dropdown-new"
                options={UsersArray.map(item => {
                  return { key: item }
                })}
                onSelect={(id) => { setSelectedDropDown({ ...selectedDropdown, userDropdown: id }); }}
                selected={selectedDropdown.userDropdown}
              />
            </div>
          </div>
        </>

      }

      {/* User details */}
      {props.userDetailVisibility &&
        <UserDetail
          onClose={() => props.actions.setredux(false, "userDetailVisibility")}
          userDetail={props.userDetailVisibility}
          UsersArray={UsersArray}
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
export default withNamespaces()(connect(mapStateToProps, mapDispatchToProps)(IPSUsers));
