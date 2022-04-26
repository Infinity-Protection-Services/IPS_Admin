
import React, { useState, useEffect } from "react";
import { withNamespaces } from "react-i18next";
import { MDBDataTable, MDBIcon } from "mdbreact";
import { Button } from "reactstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import AddIcon from "@material-ui/icons/Add";

import { Back_arrow, Edit as IconEdit, IconEye, IconDelete, DeletePopup, } from "../../../Assets/Images/web";
import AddProduct from "./addEditProduct";
import ViewProduct from "./viewProduct";
import { crudAction } from "../../../Store/Actions";
import { commonActions, commonMethods } from "../../../Utils";
import * as entity from '../../../Common/entity'

function Product(props) {
  const [confirm_both, setconfirm_both] = useState(false);
  const [data, setData] = useState({ columns: [], rows: [] });

  // fecth Product data
  useEffect(() => {
    if (props.showAddPage !== undefined && props.showEditPage !== undefined) {
      const payload = {
        type: "getAllProducts",
        product_search: ""
      }
      if (!props.showAddPage && !props.showEditPage) {
        props.actions.postAll(entity.GetAllProducts, payload, "GetAllProductList")
      }
    }
  }, [props.delete_product, props.showAddPage, , props.showEditPage])

  useEffect(() => {
    props.delete_product && setconfirm_both(false)
  }, [props.delete_product])

  // set Table data
  useEffect(() => {
    props.GetAllProductList && props.GetAllProductList.data && setData({
      ...data, rows: props.GetAllProductList.data.map((item, index) => {
        const temp_title = commonMethods.ConvertToCamelCase(item.title)
        const temp_description = commonMethods.ConvertToCamelCase(item.description)
        item['product_id'] = item.id
        item['index'] = index + 1
        item['title'] = (temp_title.replaceAll("`d", '"')).replaceAll('`', "'")
        item['price'] = "$" + item.price
        item['description'] = (temp_description.replaceAll("`d", '"')).replaceAll('`', "'")
        item['action'] = <div className="d-flex product-action-wrapper">
          <commonMethods.ActionProduct src={IconEye} id="View" onClick={() => HandleActions("View", true, item)} />
          <commonMethods.ActionProduct src={IconEdit} id="Edit" onClick={() => HandleActions("Edit", true, item)} />
          <commonMethods.ActionProduct src={IconDelete} id="Delete" onClick={() => setconfirm_both(item)} />
        </div>
        item['image'] = <img className="product-image" alt="product"
          src={commonMethods.setImages((item.images.split(","))[0])}
        />
        return item
      }
      )
    })
  }, [props.GetAllProductList])

  // set table heading
  useEffect(() => {
    setData({
      ...data,
      columns: [
        { label: `${props.t("No")}`, field: "index", },
        { label: `${props.t("Image")}`, field: "image", sort: "disabled", },
        { label: `${props.t("Product")}`, field: "title", },
        { label: `${props.t("Price")}`, field: "price", sort: "disabled" },
        { label: `${props.t("Action")}`, field: "action", sort: "disabled", },
      ]
    })
  }, [props.t])

  // Product Data Actions
  const HandleActions = (flag, value, data) => {
    if (flag === "Add") {
      props.actions.setredux(value, "showAddPage");
    } else if (flag === "View") {
      props.actions.setredux(data, "showViewPage");
    } else {
      props.actions.setredux(data, "showEditPage");
    }
  }

  // Delete Product
  const ProductDeleteHandler = async (payload) => {
    // we don't want to delete images because it is been showing in order list
    // await props.actions.deleteImageFromS3(confirm_both.images.split(","))
    // await props.actions.deleteImageFromS3(confirm_both.size_chart.split(","))
    props.actions.postAll(entity.DeleteProduct, payload, "delete_product", true)
  }

  return (
    <>
      {/* Header */}
      {props.showViewPage ? (
        // View Product Page Header
        <div className="input-group Heading-Wrapper-container">
          <div className="form-outline Heading-Wrapper  search-wrapper ">
            <img src={Back_arrow} className="back-arrow" alt="back-arrow"
              onClick={() => { props.showViewPage && props.actions.setredux(false, "showViewPage"); }}
            />
            <span className="details-text">{props.t("Product Details")}</span>
          </div>
          {!props.showViewPage && (
            <button className="btn-save add_button_new" onClick={(e) => HandleActions("Add", true)}>
              {props.t("Save")}
            </button>
          )}
        </div>
      ) : (
        // Product Table screen header
        !props.showViewPage && String(props.showAddPage).includes(false) && String(props.showEditPage).includes(false) &&
        <div className="input-group serach-wrapper-container" >
          <div className="form-outline search-wrapper" style={{ minWidth: '100px' }}>
            {/* <input type="text" placeholder={props.t("Search Product Here")} className="form-control search" autoComplete="off" /> */}
            {/* onChange={SearchOnChangeHandler} */}
            {/* <img src={Search} className="search-image" alt="search" /> */}
          </div>
          <button button className="add_button" onClick={(e) => HandleActions("Add", true)}>
            <span className="add-icon"><AddIcon /></span>
            <span>{props.t("Add New")}</span>
          </button>
        </div>
      )
      }

      {/* Screen */}
      {
        props.showViewPage ?
          <ViewProduct data={props.showViewPage} />
          : ((props.showAddPage && props.showAddPage !== "false") || (props.showEditPage && props.showEditPage !== "false")) ?
            (props.showAddPage || props.showEditPage) &&
            <AddProduct data={typeof (props.showEditPage) === "object" ? props.showEditPage : false} />
            :
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
                          ProductDeleteHandler(payload)
                        }}>{props.t("Yes")}</Button>
                      </>
                    }
                    Body={() => (
                      <>
                        <img className="delete-product-image" src={DeletePopup} alt="delete-product" />
                        <div className="product-delete-heading">
                          <span>{props.t("Delete Product")}</span>
                        </div>
                        <div className="product-delete-text-wrapper">
                          <span className="product-delete ">
                            {props.t("Are you sure you want")} <br /> {props.t("to delete this product from product list?")}
                          </span>
                        </div>
                      </>
                    )}
                  />
                ) : null}

                <div className="customer-support-table-wrapper-new common-wrapper product-table order-table">
                  <MDBDataTable
                    responsive
                    noRecordsFoundLabel={<div className="no-data-found">{props.t("No products found!")}</div>}
                    data={data}
                    paginationLabel={[
                      <MDBIcon icon="angle-left" size="sm" />,
                      <MDBIcon icon="angle-right" size="sm" />,
                    ]}
                    noBottomColumns={true}
                    entriesOptions={props.entryOptions}
                    displayEntries={true}
                    info={false}
                  />
                  <br/>
                  Showing 1 to 10 of {data.rows.length} entries.
                </div>
              </div>
            </>
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
export default withNamespaces()(connect(mapStateToProps, mapDispatchToProps)(Product));
