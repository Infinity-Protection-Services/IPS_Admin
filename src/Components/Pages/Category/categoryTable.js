import React, { useEffect, useState } from "react";
import { withNamespaces } from "react-i18next";
import { MDBDataTable, MDBIcon } from "mdbreact";
import { Button } from "reactstrap";
import AddIcon from "@material-ui/icons/Add";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// import { Search } from "../../../Assets/Images/web";
import { AddEditJobCategory, GetAllJobCategory } from "../../../Common/entity";
import { crudAction } from "../../../Store/Actions";
import { storageUtils, commonMethods, commonActions } from '../../../Utils'

function CategoryTable(props) {
  const [addEditCategory, setAddEditCategory] = useState({ visibility: false, data: [] });
  const [data, setData] = useState({ columns: [], rows: [] })
  const [flag, setflag] = useState(false)
  const [title_temp, setTitleTemp] = useState("")

  // set table column name
  useEffect(() => {
    setData({
      ...data,
      columns: [
        { label: `${props.t("No")}`, field: "index", },
        { label: props.t("Category"), field: "title", },
        { label: `${props.t("Action")}`, field: "action", attributes: { className: "action" }, },
      ]
    })
  }, [props.t])

  // Api call to get categories
  useEffect(() => {
    setAddEditCategory({ visibility: false });
    const payload = {
      type: "getAllJobCategoryAdmin",
      category_search: "",
      is_job:0
    }
    props.actions.postAll(GetAllJobCategory, payload, "GetAllJobCategory")
  }, [props.AddEditJobCategory])

  // set data according to category response
  useEffect(() => {
    if (props.GetAllJobCategory && props.GetAllJobCategory.data) {

      setData({
        ...data, rows: props.GetAllJobCategory.data.map((item, index) => {
          return {
            ...item,
            category_id: item.id,
            index: index + 1,
            title: commonMethods.ConvertToCamelCase(item.title),
            action: <div className="d-flex category-action">
              <commonMethods.Action setAddEditCategory={setAddEditCategory} item={item} id={index} />
              <commonMethods.DisableCategory
                onChange={() => {
                  setAddEditCategory({ ...addEditCategory, data: item })
                  handleSubmit({ id: item.id, title: item.title, status: item.status === 1 ? 0 : 1, flag: true })
                  props.actions.setredux(props.GetAllJobCategory, "GetAllJobCategory")
                }}
                item={item}
                id={index}
                checked={item.status === 0 ? true : false}
                tooltipMsg={props.t("Toggle to Enable / Disable")}
              />
            </div>
          }
        })
      })
    }
  }, [props.GetAllJobCategory, flag])

  // Handle Add and Edit Category
  const handleSubmit = async (values) => {
    const CategoryList = props.GetAllJobCategory.data.map(item => {
      return item.title.toLowerCase()
    })
    const value = values
    value.title = commonMethods.ConvertToCamelCase(value.title.trim())
    if (value.title) {
      if (!value.flag && CategoryList.includes(value.title.toLowerCase())) {
        if (!addEditCategory.visibility || (addEditCategory.visibility && (commonMethods.ConvertToCamelCase(addEditCategory.data?.title) !== commonMethods.ConvertToCamelCase(value.title)) && CategoryList.includes(value.title.toLowerCase()))) {
          props.actions.setredux("Category already exists!", 'error_message', "ERROR_MESSAGE")
        }
        else {
          document.getElementById("submit-button").disabled = true
        }
        document.getElementById("title").value = value.title
      }
      else {
        delete value['flag']
        delete []
        if ((addEditCategory.data && addEditCategory.data.title !== value.title) || (!addEditCategory.data)) {
          const data = Object.assign({}, value, {
            type: "addEditJobCategory",
            user_id: storageUtils.getAuthenticatedUser().user.id,
          })
          await props.actions.postAll(AddEditJobCategory, data, "AddEditJobCategory", true);
          setflag(!flag)
        }
        else { setAddEditCategory({ visibility: false }) }
      }
    }
    setTitleTemp("")
  };
  return (
    <>
      {/* seach bar and Add new button */}
      <div className="input-group serach-wrapper-container ">
        <div className="form-outline search-wrapper" >
          {/* <input type="text" placeholder={props.t("Search Product Here")} className="form-control search" autoComplete="off" /> */}

        </div>
        <button className="add_button" onClick={() => { setAddEditCategory({ visibility: true }); }}>
          <span className="add-icon"><AddIcon /></span>
          <span>{props.t("Add New")}</span>
        </button>
      </div>

      {/* Category data table */}
      <div className="customer-support-table-wrapper-new common-wrapper p-r new-jobs-table-wrapper">
        <MDBDataTable
          noBottomColumns={true}
          noRecordsFoundLabel={<div className="no-data-found">{props.t('No category found!')}</div>}
          paginationLabel={[<MDBIcon icon="angle-left" size="lg" />, <MDBIcon icon="angle-right" size="lg" />,]}
          info={false}
          responsive
          bordered
          data={data}
          small
          hover
          entriesOptions={props.entryOptions}
          displayEntries={true}
        />
        <br/>
        Showing 1 to 10 of {data.rows.length} entries.
      </div>

      {/* Add and Edit Category modal */}

      {
        addEditCategory.visibility && (
          <div id="create-course-form" className="needs-validation">

            <commonMethods.RenderSweetAlert
              custom showCancel
              onCancel={() => { setAddEditCategory({ visibility: false }) }}
              CustomButton={
                <>
                  <Button className="btn-no mr-4 cancel-button" onClick={() => { setAddEditCategory({ visibility: false }); }}>{props.t("Cancel")}</Button>
                  <Button className="mr-4 add-button" id="submit-button"
                    onClick={(e) => {
                      e.preventDefault()
                      const values = { title: "" }

                      values.title = document.getElementById("title").value
                      if (String(title_temp.trim() || values.title.trim()).length > 0) {
                        if (values.title) {
                          setTitleTemp(values.title)
                        }
                        else {
                          values.title = title_temp
                        }

                        const payloadValue = addEditCategory.data ?
                          Object.assign({}, values, { id: addEditCategory.data.id, status: addEditCategory.data.status }) :
                          { ...values, status: 0 }
                        handleSubmit(payloadValue)
                      }
                      else {
                        props.actions.setredux("category name can not be empty", 'error_message', "ERROR_MESSAGE")
                      }
                    }}
                  > {addEditCategory.data ? props.t("Update") : props.t("Add")} </Button>
                </>
              }
              Body={(renderProps) => (
                <AvForm>
                  <div className="sweet-alert">
                    <span className="add">{addEditCategory.data ? props.t("Update") : props.t("Add New")} {props.t("Category")}</span>
                    <br />
                    <div className="form-wrapper">
                      <span className="category">{props.t("Category")}</span>
                      <AvField type="text" className="input" name="title" id="title"
                        value={addEditCategory.data && commonMethods.ConvertToCamelCase(addEditCategory.data.title)}
                        autoComplete="off"
                        onChange={() => {
                          if (addEditCategory.data) {
                            if (addEditCategory.data.title === document.getElementById("title").value) {
                              document.getElementById("submit-button").disabled = true
                            }
                            else {
                              document.getElementById("submit-button").disabled = false
                            }
                          }
                        }}
                        errorMessage={props.t("Please enter category name")}
                        placeholder={props.t("Enter category name")}
                        validate={{ required: { value: true } }}
                      />
                    </div>
                  </div>
                </AvForm>
              )}
            />

          </div>
        )
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
export default withNamespaces()(connect(mapStateToProps, mapDispatchToProps)(CategoryTable));
