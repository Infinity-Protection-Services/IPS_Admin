import React, { useState, useEffect } from "react";
import { withNamespaces } from "react-i18next";

import { Row, Col, CardBody, FormGroup } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import Dropzone from "react-dropzone";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { SizeChart, IconAdd, IconRemove, IconAddPhoto, Back_arrow, Upload } from "../../../Assets/Images/web";
import { crudAction } from "../../../Store/Actions";
import { commonActions, commonMethods } from "../../../Utils";
import * as actionTypes from '../../../Common/actionTypes'
import * as entity from '../../../Common/entity'

function AddEditProduct(props) {
  const { data } = props
  const [errors, setErrors] = useState()
  const [sizeStockdata, setSizeStockData] = useState([])
  const [variants, setVariants] = useState([{ size: "", stock: "" }]);
  const [selectedFiles, setselectedFiles] = useState((data && data.images?.split(",")) || []);
  const [addorDeleteImage, setAddOrDeleteImage] = useState({ deletedImage: [], newAddedImage: [] })
  const [sizeChartName, setSizeChartName] = useState({ name: "", file: data && data.size_chart });

  // set size & Stocks @Edit
  useEffect(() => {
    if (data) {
      var size = data.size.split(",")
      var stock = data.stock.split(",")
      var sizeArray = size.map(item => {
        return { size: item }
      })
      var stockArray = stock.map(item => {
        return { stock: parseInt(item) }
      })
      var variantToAssign = sizeArray.map((item, id1) => {
        return stockArray.map((item2, id2) => {
          if (id1 === id2)
            return Object.assign({}, item, item2)
        })
      }).flat().filter(item => {
        if (item !== undefined) {
          return item
        }
      })
      setSizeStockData(variantToAssign)
      setVariants(variantToAssign)
    }
  }, [])

  // to empty Uploaded_product_image_s3 and AddEditProduct
  useEffect(() => {
    return () => {
      props.actions.SetNull({ type: actionTypes.FETCH, entity: "Uploaded_product_image_s3", payload: [] });
      props.actions.SetNull({ type: actionTypes.FETCH, entity: "AddEditProduct" });
    }
  }, [])

  // return to product table
  useEffect(() => {
    if (props.AddEditProduct) {
      props.actions.SetNull({ entity: "showAddPage", payload: false })
      props.actions.SetNull({ entity: "showEditPage", payload: false })
    }
  }, [props.AddEditProduct])

  // upload product image to S3
  const handleAcceptedFiles = async (files) => {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setselectedFiles(selectedFiles.concat(files));
    if (data) {
      setAddOrDeleteImage({ ...addorDeleteImage, newAddedImage: addorDeleteImage.newAddedImage.concat(files) })
    }
  }

  // To add size & stocks
  const handleAdd = () => {
    const values = [...variants];
    values.push({ size: "", stock: "" });
    setVariants(values);
    setErrors(variants.length)
  }

  // to remove size & stock
  const handleRemove = (i) => {
    const values = [...variants];
    values.splice(i, 1);
    setVariants(values);
    if (data && i <= sizeStockdata.length) {
      sizeStockdata.splice(i, 1);
      setSizeStockData(sizeStockdata);
    }
    if (errors === i || variants.length === 1) { setErrors() }
  }

  // remove image from s3
  const RemoveImage = (i) => {
    const values = [...selectedFiles];
    values.splice(i, 1);
    setselectedFiles(values);
    if (data && typeof (selectedFiles[i]) === 'string') {
      const values = [...selectedFiles];
      const abc = (addorDeleteImage.deletedImage).concat(values.splice(i, 1))
      setAddOrDeleteImage({ ...addorDeleteImage, deletedImage: abc })
    }
  }

  // Handle Edit / Add Submit
  const handleSubmit = async (event, error, values) => {
    if (error.length === 0 && !errors) {

      let response = { product_image: [], size_chart: [] }, size_chart_name = Date.parse(new Date) + "_size_chart";
      // delete Images @Edit
      await props.actions.deleteImageFromS3(addorDeleteImage.deletedImage, props.Uploaded_product_image_s3)

      // Upload shirt images
      const fileobject = selectedFiles.filter(item => { return typeof (item) !== "string" })
      response.product_image = fileobject.length > 0 ? await props.actions.imageUplaodToS3(fileobject, props.Uploaded_product_image_s3) : selectedFiles

      // upload size chart image
      if (data && data.length === 0) {
        size_chart_name = data.size_chart.split("/");

        // delete previos size chart to overcome jpg and png image issue
        if (typeof (sizeChartName.file) === 'object') {
          await props.actions.deleteImageFromS3([data.size_chart])
        }
        size_chart_name = ((size_chart_name[size_chart_name.length - 1]).split("."))[1]
      }

      response.size_chart =
        typeof sizeChartName.file === "object" &&
        !!sizeChartName.file &&
        (await props.actions.imageUplaodToS3(
          [sizeChartName.file],
          [],
          size_chart_name
        ));

      // Images array @product images
      const imageArray = selectedFiles.concat(response.product_image && response.product_image.map(x => {
        if (typeof (x.location) === 'string') { return x.location }
      })).filter((item, id) => {
        if (typeof (item) === 'string') { return item }
      })

      const title_temp = commonMethods.ConvertToCamelCase(values.title)

      const payload = Object.assign({}, values, {
        type: "addEditProduct",
        images: imageArray ? imageArray : [],
        size_chart: response.size_chart[0] && response.size_chart[0].location || sizeChartName.file,
        variants: variants.map(item => { return { ...item, size: item.size.toUpperCase() || "none" } }),
        price: parseInt(values.price),
        title: (title_temp.replaceAll("'", '`')).replaceAll('"', '`d'),
        description: (values.description.replaceAll("'", '`')).replaceAll('"', '`d')
      })
      if (data) {
        payload['product_id'] = data.id
      }
      props.actions.postAll(entity.AddEditProduct, payload, "AddEditProduct", true)
    }
  };

  // Size_chart
  const SizeChartImageHandler = (e) => {
    const fullPath = document.getElementById("size_chart").value;
    var startIndex = fullPath.indexOf("\\") >= 0 ? fullPath.lastIndexOf("\\") : fullPath.lastIndexOf("/"); var sizechartName = fullPath.substring(startIndex);
    if (sizechartName.indexOf("\\") === 0 || sizechartName.indexOf("/") === 0) {
      sizechartName = sizechartName.substring(1);
    }
    setSizeChartName({ name: sizechartName, file: e.target.files[0] });
  }

  // Size validation and size Stock handle
  const SizeAndStockHandler = (e, idx, field) => {
    let variantsCopy = { ...variants }
    let updatedVariantCopy;
    if (field === 'size') {
      updatedVariantCopy = { [idx]: { ...variants[idx], [field]: e.target.value } }
    } else {
      updatedVariantCopy = { [idx]: { ...variants[idx], [field]: parseInt(e.target.value) } }
    }
    let variantToAssign = Object.assign([], variantsCopy, updatedVariantCopy)
    if (field === 'size') {
      const ab = variants.map(item => {
        if (item[field]) {
          return item[field].toLowerCase() === e.target.value.toLowerCase()
        }
      })
      setErrors()
      if (ab.includes(true)) {
        updatedVariantCopy = { [idx]: { ...variants[idx], [field]: "" } }
        variantToAssign = Object.assign([], variantsCopy, updatedVariantCopy)
        setErrors(idx)
        props.actions.setredux(`${e.target.value} ${"size already exists!"}`, 'error_message', actionTypes.ERROR_MESSAGE)
      }
    }
    setVariants(variantToAssign)
  }

  return (
    <React.Fragment>
      <AvForm className="needs-validation " onSubmit={handleSubmit}>
        {/* Header */}
        <div className="input-group Heading-Wrapper-container  w-100p ">
          <div className="form-outline Heading-Wrapper  search-wrapper">
            <img
              src={Back_arrow}
              className="back-arrow"
              alt="back-arrow"
              onClick={() => {
                props.showEditPage &&
                  props.actions.setredux("false", "showEditPage");
                props.showAddPage &&
                  props.actions.setredux("false", "showAddPage");
              }}
            />
            <span className="details-text">
              {" "}
              {data ? props.t("Edit") : props.t("Add New")}{" "}
            </span>
          </div>
          <button type="submit" className="btn-save add_button_new">
            {props.t("Save")}
          </button>
        </div>

        {/* Details */}
        <div className="add-product-wrapper">
          <div className="card">
            <CardBody>
              <div className="common-wrapper">
                {/* Photos */}
                <Row className="mb-10">
                  <Col md="12">
                    <FormGroup>
                      <div className="label">{props.t("Photos")}</div>
                      <Row>
                        {selectedFiles.map((f, i) => {
                          return (
                            <div key={i}>
                              <Col
                                md="1"
                                sm="2"
                                style={{ marginBottom: "10px" }}
                              >
                                <div className="dropzone-wrapper">
                                  <img
                                    src={f.preview || f}
                                    className="add-product-image"
                                    alt="Add Product"
                                  />
                                  <img
                                    className="remove-add-product-image"
                                    alt="Remove Added"
                                    src={IconRemove}
                                    onClick={() => {
                                      RemoveImage(i);
                                    }}
                                  />
                                </div>
                              </Col>
                            </div>
                          );
                        })}

                        <Col>
                          <Dropzone
                            accept="image/jpeg,image/png,image/jpg"
                            onDrop={(acceptedFiles) => {
                              handleAcceptedFiles(acceptedFiles);
                            }}
                          >
                            {({ getRootProps, getInputProps }) => (
                              <section className="product-image-dropzone">
                                <div {...getRootProps()} className="dropzone">
                                  {selectedFiles.length === 0 && (
                                    <div>
                                      {" "}
                                      <AvField
                                        name="images"
                                        id="images"
                                        className="d-none"
                                        errorMessage={props.t(
                                          "Please select Image"
                                        )}
                                        validate={{ required: { value: true } }}
                                      />
                                    </div>
                                  )}
                                  <input {...getInputProps()} />
                                  <div className="d-grid">
                                    <img
                                      className={
                                        selectedFiles.length === 0
                                          ? "add-img-icon mt-15p"
                                          : "add-img-icon mt-30p"
                                      }
                                      src={IconAddPhoto}
                                      alt="Add Icon"
                                    />
                                    <span>{props.t("Add Photo")}</span>
                                  </div>
                                </div>
                              </section>
                            )}
                          </Dropzone>
                        </Col>
                      </Row>
                    </FormGroup>
                  </Col>
                </Row>

                {/* Title */}
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <div className="label">{props.t("Title")}</div>
                      <AvField
                        name="title"
                        placeholder={props.t("Enter title")}
                        type="text"
                        errorMessage={props.t("Please enter product title")}
                        className="form-control"
                        validate={{ required: { value: true } }}
                        id="title"
                        value={data && data.title}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                {/* Size and Stocks */}
                <div className="d-flex">
                  <Col md="3" className="ml-12">
                    <div className="label">{props.t("Size & Stocks")}</div>
                  </Col>
                  <Col md="3" className="add-more-stock-wrapper">
                    <span className={errors ? "mr-12" : ""}>
                      {" "}
                      {props.t("Add More")}
                    </span>
                    {!errors && variants[0].size && variants[0].stock && (
                      <img
                        className="pl-2 mr-12"
                        src={IconAdd}
                        alt="add"
                        onClick={handleAdd}
                      />
                    )}
                  </Col>
                </div>
                <div>
                  {variants.map((field, idx) => {
                    return (
                      <div key={`${field}-${idx}`} className="mb-10">
                        <Row>
                          <Col md="3" className="h-56">
                            <FormGroup>
                              <div className="input-group">
                                <div className="input-group-prepend w-100p">
                                  <span className="input-group-text ">
                                    {props.t("Size")}
                                  </span>
                                  <AvField
                                    name={`variants[${idx}][size]`}
                                    type="text"
                                    id="size"
                                    placeholder={props.t("Enter")}
                                    value={variants[idx]["size"]}
                                    disabled={
                                      data
                                        ? sizeStockdata.length > idx
                                          ? true
                                          : false
                                        : errors && errors !== idx
                                    }
                                    onChange={(e) => {
                                      SizeAndStockHandler(e, idx, "size");
                                    }}
                                    errorMessage={props.t("Please enter product size")}
                                    className="form-control "
                                    validate={{ required: { value: true } }}
                                  />
                                </div>
                              </div>
                            </FormGroup>
                          </Col>
                          <Col md="3" className="p-r h-56">
                            <FormGroup className={idx > 0 ? "size-stocks" : ""}>
                              <div className="input-group">
                                <div className="input-group-prepend w-100p">
                                  <span className="input-group-text">
                                    {props.t("Stock")}
                                  </span>
                                  <AvField
                                    id="stock"
                                    name={`variants[${idx}][stock]`}
                                    type="text"
                                    placeholder={props.t("Enter")}
                                    min={0}
                                    value={field.stock}
                                    onKeyDown={(e) => {
                                      commonMethods.AllowOnlyNumbersHanlder(
                                        e,
                                        2
                                      );
                                    }}
                                    onChange={(e) => {
                                      if (e.target.value)
                                        SizeAndStockHandler(e, idx, "stock");
                                    }}
                                    errorMessage={props.t(
                                      "Please enter stock value"
                                    )}
                                    className="form-control"
                                    validate={{ required: { value: true } }}
                                  />
                                </div>
                              </div>
                            </FormGroup>
                            {(idx > 0 || (errors && errors === idx)) && (
                              <div className="remove-size-stocks">
                                <img
                                  src={IconRemove}
                                  alt="remove"
                                  onClick={() => handleRemove(idx)}
                                />
                              </div>
                            )}
                          </Col>
                        </Row>
                      </div>
                    );
                  })}
                </div>

                {/* Price and size chart */}
                <Row>
                  <Col md="3">
                    <FormGroup>
                      <div className="label">{props.t("Price")}</div>
                      <AvField
                        name="price"
                        type="text"
                        id="price"
                        placeholder={props.t("Enter price")}
                        errorMessage={props.t("Please enter product price")}
                        className="form-control"
                        onKeyDown={(e) => {
                          commonMethods.AllowOnlyNumbersHanlder(e, 2);
                        }}
                        autoComplete="off"
                        validate={{ required: { value: true } }}
                        min={0}
                        value={data ? data.price.substring(1) : ""}
                      />
                    </FormGroup>
                  </Col>

                  <Col md="3">
                    <FormGroup>
                      <div className="label">{props.t("Size Chart")}</div>
                      <div className="custom-file  cur-point ">
                        <label className="form-control p-r">
                          <AvField
                            type="file"
                            id="size_chart"
                            name="size_chart"
                            accept="image/jpeg, image/png"
                            className="custom-file-input  cur-point"
                            onChange={SizeChartImageHandler}
                          />
                          <div className="p-a size-chart-name">
                            <img
                              className="size-chart-preview"
                              alt="size-chart"
                              src={
                                !sizeChartName.file
                                  ? Upload
                                  : data &&
                                    sizeChartName.file === data.size_chart
                                  ? data.size_chart
                                  : SizeChart
                              }
                            />
                            <span
                              className={
                                !sizeChartName.file
                                  ? "ml-5 disable-text"
                                  : "ml-5"
                              }
                            >
                              {sizeChartName.name ||
                                (!data && props.t("Upload size chart"))}
                            </span>
                          </div>
                        </label>
                      </div>
                    </FormGroup>
                    {sizeChartName.file && (
                      <img
                        className="delete-size-chart"
                        alt="Remove Added"
                        src={IconRemove}
                        onClick={() => {
                          setSizeChartName({ name: "", file: null });
                        }}
                      />
                    )}
                  </Col>
                </Row>

                {/* Description */}
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <div className="label">{props.t("Description")}</div>
                      <div className="custom-file">
                        <AvField
                          type="textarea"
                          name="description"
                          id="description"
                          placeholder={props.t("Product description")}
                          errorMessage={props.t(
                            "Please enter product Description"
                          )}
                          className="form-control"
                          validate={{ required: { value: true } }}
                          rows="5"
                          value={data && data.description}
                        />
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
              </div>
            </CardBody>
          </div>
        </div>
      </AvForm>
    </React.Fragment>
  );
}

const mapStateToProps = ({ crud }) => {
  return (crud)
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Object.assign({}, crudAction, commonActions), dispatch),
});

export default withNamespaces()(connect(mapStateToProps, mapDispatchToProps)(AddEditProduct));
