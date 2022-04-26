import React, { Component } from "react";
import { Back_arrow } from "../../../Assets/Images/web";
import { commonMethods, commonActions } from "../../../Utils";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  GetAllJobCategory,
  GetAllProviderSearchByName,
  GetAllJobPostAdmin,
} from "../../../Common/entity";
import * as actionTypes from "../../../Common/actionTypes";
import { crudAction } from "../../../Store/Actions";
import moment from "moment";
import { IconAdd, IconRemove } from "../../../Assets/Images/web";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { SUCCESS_MESSAGE, ERROR_MESSAGE } from "../../../Common/actionTypes";
import priceData from "./Enum.json";
import LocationSearchInput from "./LocationFile";

import {
  Card,
  CardBody,
  Col,
  FormGroup,
  Label,
  Row,
  TabPane,
  Button,
} from "reactstrap";

import _ from "lodash";
import ExpertiseSelect from "./ExpertiseSelect";
import DatePickerFelid from "./DatePickerFeild";
import DatePickerFeildNew from "./DatePickerFeildNew";
import { Formik, ErrorMessage, Form } from "formik";
import * as Yup from "yup";
import Autocomplete from "react-google-autocomplete";

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import classnames from "classnames";
import { postData } from "../../../Utils/httpUtils";
import AsyncSelect from "react-select/async";
import { withRouter } from "react-router-dom";

const firstPriceData = priceData[0];
const days = [
  "All Days",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const initState = {
  category_search: "",
  title: "",
  expertise: [],
  description: "",
  is_auto_job_assign: false,
  location: "",
  street_address: "",
  city: "",
  state: "",
  zipcode: "",
  is_post_visible: "",
  years_of_experience: firstPriceData.noOfExperience,
  cityy: firstPriceData.CityData[0].city,
  provider_type: firstPriceData.CityData[0].PriceData[0].personType,
  rate_per_hour: firstPriceData.CityData[0].PriceData[0].Price,
  number_of_provider: "",
  no_of_year: "",
  payment_city: "",
  user_type: "",
  recommended_rate: "",
  payment_mode: 0,
  provider_id: [],
  backup_provider_id: [],
  job_id: [],
  is_inprogress_job: "",
  multiple_dates: [
    {
      start_date: "",
      end_date: "",
      start_time: "",
      end_time: "",
      select: false,
      days: [],
      box_id: "",
      job_dates: [],
      job_id:[],

  },
  ],
  provider_box:[{
    box_id:[],
    provider_id:[],
  }]
};

const getRatePerHour = (yoe, city, pt) =>
  priceData
    .find((data) => data.noOfExperience === yoe)
    .CityData.find((cityData) => cityData.city === city)
    .PriceData.find((priceData) => priceData.personType === pt).Price;

const validationSchemaJob = Yup.object().shape({
  title: Yup.string().trim().required("Title is required field"),
  expertise: Yup.array()
    .min(1, "Select atleast one expertise.")
    .of(
      Yup.object().shape({
        label: Yup.string().required(),
        value: Yup.string().required(),
      })
    )
    .required("Expertise is required field"),
  description: Yup.string().required("Description is required field"),
});

const validationSchemaLocation = Yup.object().shape({
  location: Yup.string().required("Location is required field"),
  street_address: Yup.string().required("Street address is required field"),
  city: Yup.string().required("City is required field"),
  state: Yup.string().required("State is required field"),
  zipcode: Yup.string()
    .required("Zip code is required field")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(5, "Must be at least 5 digits")
    .max(6, "Must be at most 6 digits"),
  is_post_visible: Yup.string().required("Please select user"),
  provider_id: Yup.array().when("is_post_visible", {
    is: (value) => +value === 1,

    then: Yup.array()
      .min(1, "Please add provider")
      .of(
        Yup.object()
          .shape({
            label: Yup.string().required(),
            value: Yup.string().required(),
          })
          .required("Please add providers")
      ),
    otherwise: Yup.array().nullable(),
  }),
});

const validationSchemaPricing = Yup.object().shape({
  is_post_visible: Yup.string().when("payment_mode", {
    is: 0,
    then: Yup.string()
      .typeError("Is Post Visible must be a string")
      .min(0, "Is Post Visible should be more than 0.")
      .required("Is Post Visible is required field"),
    otherwise: Yup.string().nullable(),
  }),

  cityy: Yup.string().when("payment_mode", {
    is: 0,
    then: Yup.string()
      .typeError("City must be a string")
      .min(0, "City should be more than 0.")
      .required("City is required field"),
    otherwise: Yup.string().nullable(),
  }),


  years_of_experience: Yup.string().when("payment_mode", {
    is: 0,
    then: Yup.string()
      .typeError("Years of experience must be string")
      .required("Years of experience must be required"),
    otherwise: Yup.string().nullable(),
  }),

  provider_type: Yup.string().when("payment_mode", {
    is: 0,
    then: Yup.string()
      .typeError("Provider type must be a string")
      .min(0, "Provider type should be more than 0.")
      .required("Provider type is required field"),
    otherwise: Yup.string().nullable(),
  }),

  rate_per_hour: Yup.number().when("payment_mode", {
    is: 0,
    then: Yup.number()
      .typeError("Rate per hour must be a number")
      .min(0, "Rate per hour should be more than 0.")
      .required("Rate per hour is required field"),
    otherwise: Yup.number().nullable(),
  }),

  number_of_provider: Yup.number().when("payment_mode", {
    is: 0,
    then: Yup.number()
      .typeError("Number Of Provider must be a number")
      .min(1, "Number Of Provider should be more than 0.")
      .required("Number Of Provider is required field"),
  }),

  multiple_dates:Yup.array().of(
        Yup.object().shape({
        start_time: Yup.string().required("Start Time is required"),
        end_time: Yup.string()
        .required("End Date is required"),
        days:Yup.array().min(1,"Minimum one day selected").required("Days are required field")
  })),

  recommended_rate: Yup.number().required("Recommended rate required field"),
});

const validationSchemas = [
  validationSchemaJob,
  validationSchemaLocation,
  validationSchemaPricing,
];

class EditJobDetail extends Component {
  constructor(props) {
    super(props);

    this.myRef = React.createRef(null)
    this.state = {
      temp: this.props.editjob.job_requests.filter(
        (x) => x.is_req_send_by_provider === 1
      ),
      activeTab: 0,
      passedSteps: [0],
      startDate: new Date(),
      inputValue: "",
      infoDialog: false,
      currentProvider:{},
      location:null,

      rate_per_hour: {
        temp_start_date: new Date(props.editjob.start_date),
        temp_end_date: new Date(props.editjob.end_date),
        temp_start_time: new Date(
          `${props.editjob.start_date} ${props.editjob.start_time}`
        ),
        temp_end_time: new Date(
          `${props.editjob.end_date} ${props.editjob.end_time}`
        ),
      },
      fixed_rate: {
        temp_start_date: new Date(),
        temp_end_date: new Date(),
        temp_start_time: "",
        temp_end_time: "",
        recommended_rate: "",
        number_of_provider: "",
      },

      multiple_dates: this.props.editjob.job_multiple_dates.map(
        (x) => {
          x.start_time = moment(x.start_date + " " + x.start_time).format(
            "hh:mm A"
          );
          x.end_time = moment(x.end_date + " " + x.end_time).format("hh:mm A");
          x.start_date = moment(x.start_date).format("MMM DD, YYYY");
          x.end_date = moment(x.end_date).format("MMM DD, YYYY");
          x.days = x.days;
          x.box_id = x.id;
          x.job_dates = x.job_dates;
          return x;
        }
      ),
      oldData: _.cloneDeep(this.props.editjob.job_multiple_dates) ,
      newValue : [],
      provider_box:[],
      errors: "",
      checkedState: new Array(days.length).fill(false),
      data: {
        category_search: props?.GetAllJobCategory?.data.map((x) => x.title),
        id: props.editjob.id,
        parent_job_id: props.editjob.parent_job_id,
        user_id: props.editjob.user_id,
        company_id: props.editjob.company_id,
        title: props.editjob.title,
        expertise:
          props.editjob.job_expertises.map((x) => {
            return { value: x.category_id, label: x.title };
          }) || [],
        description: props.editjob.description,
        is_auto_job_assign: props.editjob.is_auto_job_assign,
        location: props.editjob.location,
        street_address: props.editjob.street_address,
        city: props.editjob.city,
        state: props.editjob.state,
        zipcode: props.editjob.zipcode,
        start_date: new Date(props.editjob.job_multiple_dates.start_date),
        end_date: new Date(props.editjob.job_multiple_dates.end_date),
        start_time: new Date(
          `${props.editjob.job_multiple_dates.start_date} ${props.editjob.job_multiple_dates.start_time}`
        ),
        end_time: new Date(
          `${props.editjob.job_multiple_dates.end_date} ${props.editjob.job_multiple_dates.end_time}`
        ),
        days: props.editjob.job_multiple_dates.map((x) => x.days),
        number_of_provider: props.editjob.number_of_provider,
        recommended_rate: props.editjob.recommended_rate,
        payment_mode: Number(props.editjob.payment_mode),
        is_post_visible: props.editjob.is_post_visible,

        rate_per_hour:
          props?.editjob && props?.editjob ? props.editjob.rate_per_hour : 0,
        provider_id:
          props?.editjob?.job_requests.map((x) => {
            return {
              value: x.provider_id,
              label: `${x.first_name} ${x.last_name} \n ${x.citizenship}`,
            };
          }) || [],
        backup_provider_id:
          props?.editjob?.job_requests.map((x) => {
            return {
              value: x.is_backup_provider,
              label: `${x.first_name} ${x.last_name} \n ${x.citizenship}`,
            };
          }) || [],
      },
      options: [],
    };

    this.toggleTab.bind(this);
    this.handleChangeState.bind(this);
    this.handleSelectChange.bind(this);
    this.handleChangeCheckBox.bind(this);
    this.handleChangeSelectBox.bind(this);
    this.handleAdd.bind(this);
    this.handleMultipleChangeSelectBox.bind(this);
    this.handleSubmit.bind(this);

  }
  componentDidMount() {
    this.props.actions.SetLoader(false);
    const { user_id, company_id, id } = this.state.data;
    let payload = {
      type: "getAllJobCategoryAdmin",
      category_search: "",
      is_job:1
    }

    this.props.actions.postAll(GetAllJobCategory, payload, "GetAllJobCategory");
    initState.title = this.props.editjob.title;
    initState.expertise =
      this.props.editjob.job_expertises.map((x) => {
        return { value: x.category_id, label: x.title };
      }) || [];
    initState.description = this.props.editjob.description;
    initState.is_auto_job_assign = this.props.editjob.is_auto_job_assign
      ? true
      : false;
    initState.location = this.props.editjob.location;
    initState.street_address = this.props.editjob.street_address;
    initState.city = this.props.editjob.city;
    initState.state = this.props.editjob.state;
    initState.zipcode = this.props.editjob.zipcode;
    initState.multiple_dates = this.props.editjob.job_multiple_dates.map(
      (x) => {
        x.start_time = moment(x.start_date + " " + x.start_time).format(
          "hh:mm A"
        );
        x.end_time = moment(x.end_date + " " + x.end_time).format("hh:mm A");
        x.start_date = moment(x.start_date).format("MMM DD, YYYY");
        x.end_date = moment(x.end_date).format("MMM DD, YYYY");
        x.days = x.days;
        x.box_id = x.id;
        x.job_dates = x.job_dates;
        x.job_id=x.job_id;
        x.status =x.status;
        return x;
      }
    );
      let stateValue = this?.state?.currentProvider.value;

    initState.provider_box = [
    {
      box_id : this.props.editjob.job_multiple_dates.map((x) => x.id),
      provider_id : this.props?.editjob?.job_requests.map((x) => x.provider_id),
    }]

    initState.number_of_provider = this.props.editjob.number_of_provider;
    initState.years_of_experience = this.props.editjob.no_of_year;
    initState.cityy = this.props.editjob.payment_city;
    initState.provider_type = this.props.editjob.user_type;

    initState.recommended_rate = this.props.editjob.recommended_rate;
    initState.payment_mode = Number(this.props.editjob.payment_mode);
    initState.is_post_visible = this.props.editjob.is_post_visible;
    initState.rate_per_hour =
      this.props?.editjob && this.props?.editjob
        ? this.props.editjob.rate_per_hour
        : 0;
    initState.provider_id =
      this.props?.editjob?.job_requests
        .map((x) => {
          return {
            value: x.provider_id,
            label: `${x.first_name} ${x.last_name} \n ${x.citizenship}`,
            backup: x.is_backup_provider === 0 ? true : false,
            is_req_send_by_provider: x.is_req_send_by_provider,
            is_assigned: x.is_assigned,
          };
        })
        .filter((provider) => provider.backup) || [];
    initState.backup_provider_id =
      this.props?.editjob?.job_requests
        .map((x) => {
          return {
            value: x.provider_id,
            label: `${x.first_name} ${x.last_name} \n ${x.citizenship}`,
            backup: x.is_backup_provider === 0 ? false : true,
          };
        })
        .filter((provider) => provider.backup) || [];
  }


  loadOptions = (inputValue, values) => {
    return new Promise(async (resolve) => {
      try {
        const payload = {
          type: "getAllProviderSearchByName",
          provider_name: inputValue,
        };
        const response = await postData(GetAllProviderSearchByName, payload);
        const data =
          response?.data?.data?.map((x) => {
            return {
              value: x.id,
              label: `${x.first_name} ${x.last_name} \n ${x.citizenship}`,
              is_req_send_by_provider:Number(values.is_post_visible) === 1 ? 0 : 1,
              is_assigned: Number(this.props.isFrom === "In-Progress Job")? 1: 0,
            };
          }) || [];

        const newData = _.differenceBy(
          data,
          values.backup_provider_id,
          "value"
        );
        resolve(newData);
      } catch (error) {
        console.log(error);
        resolve([]);
      }
    });
  };

  backupProviderLoadOptions = (inputValue, values) => {
    return new Promise(async (resolve) => {
      try {
        const payload = {
          type: "getAllProviderSearchByName",
          provider_name: inputValue,
        };
        const response = await postData(GetAllProviderSearchByName, payload);
        const data =
          response?.data?.data.map((x) => {
            return {
              value: x.id,
              label: `${x.first_name} ${x.last_name} \n ${x.citizenship}`,
            };
          }) || [];
        const newData = _.differenceBy(data, values.provider_id, "value");
        resolve(newData);
      } catch (error) {
        console.log(error);
        resolve([]);
      }
    });
  };

  handleDaysChange = function (position, values, idx, setFieldValue,boxId) {
    let tempDays = values.multiple_dates;
    let checkDays = values.multiple_dates[idx].days;
    if (position === 0) {
      if (checkDays.includes(position)) {
        checkDays = [];
      } else {
        checkDays = Array.from(
          {
            length: 8,
          },
          (_, i) => i
        );
      }
    } else if (checkDays.length === 6 && !checkDays.includes(position)) {
      checkDays = Array.from(
        {
          length: 8,
        },
        (_, i) => i
      );
    } else {
      if (checkDays.includes(0)) {
        checkDays.splice(
          checkDays.findIndex((x) => x === 0),
          1
        );
      }
      if (checkDays.includes(position)) {
        checkDays.splice(
          checkDays.findIndex((x) => x === position),
          1
        );
      } else {
        checkDays.push(position);
      }
    }

    tempDays[idx].days = checkDays;
    setFieldValue({ checkDays });
  };

  handleTimeChange = (setFieldValue, name, value, values, index) => {
    let tempTime = values.multiple_dates;
    this.state.newValue = tempTime;
    if (name === "end_time") {
      const newEndDate = new Date(
        `${moment(values.multiple_dates[index].end_date).format(
          "MMM DD, YYYY"
        )} ${moment(value).format("hh:mm A")}`
      );
      let temp_multiple_date = values.multiple_dates;
      temp_multiple_date[index][name] = moment(value).format("hh:mm A");
      setFieldValue("multiple_dates", temp_multiple_date);
      if (values.payment_mode === 0)
        this.handleTempStateChange(
          "rate_per_hour",
          "temp_end_time",
          newEndDate
        );
      else
        this.handleTempStateChange("fixed_rate", "temp_end_time", newEndDate);
    } else if (name === "start_time") {
      let newStartTime = new Date(
        `${moment(values.multiple_dates.start_date).format(
          "MMM DD, YYYY"
        )} ${moment(value).format("hh:mm A")}`
      );
      let temp_multiple_date = values.multiple_dates;
      temp_multiple_date[index][name] = moment(value).format("hh:mm A");
      setFieldValue("multiple_dates", temp_multiple_date);
      if (values.payment_mode === 0)
        this.handleTempStateChange(
          "rate_per_hour",
          "temp_start_time",
          newStartTime
        );
      else
        this.handleTempStateChange(
          "fixed_rate",
          "temp_start_time",
          newStartTime
        );
      } else if (name === "start_date") {
      const d1 = new Date(value);
      const d2 = new Date(values.multiple_dates[index].end_date);

      let temp_multiple_date = values.multiple_dates;
      temp_multiple_date[index][name] = moment(value).format("MMM DD, YYYY");
      setFieldValue("multiple_dates", temp_multiple_date);
      if (values.payment_mode === 0)
        this.handleTempStateChange("rate_per_hour", "temp_start_date", value);
      else this.handleTempStateChange("fixed_rate", "temp_start_date", value);

      if (d1.getTime() > d2.getTime()) {
        temp_multiple_date[index]["end_date"] =
          moment(value).format("MMM DD, YYYY");
        setFieldValue("multiple_dates", temp_multiple_date);
        if (values.payment_mode === 0)
          this.handleTempStateChange("rate_per_hour", "temp_end_date", value);
        else this.handleTempStateChange("fixed_rate", "temp_end_date", value);
        setTimeout(() => {
          this.handleCalculateRate(setFieldValue, {
            ...values,
            start_date: value,
            end_date: value,
          });
        }, 100);
      }
    } else {
      let tmp_end_date = values.multiple_dates;
      tmp_end_date[index][name] = moment(value).format("MMM DD, YYYY");
      setFieldValue("multiple_dates", tmp_end_date);
      if (values.payment_mode === 0)
        this.handleTempStateChange("rate_per_hour", "temp_end_date", value);
      else this.handleTempStateChange("fixed_rate", "temp_end_date", value);
    }
  };

  handleNumberOfProvider(setFieldValue,values){
    this.handleCalculateRate(setFieldValue, {
      ...values,
    })
  }

  handleCalculateRate = (setFieldValue, values) => {
    setTimeout(() => {
      const { rate_per_hour, payment_mode = 0, number_of_provider = 0, } = values;
      let AllDates = [];
      let total_recommended_rate = 0;
      values.multiple_dates.forEach((box, index) => {
        const { start_date, end_date, start_time, end_time, days } = box;

        const date1 = new Date(start_date);
        const date2 = new Date(end_date);
        const diffTimeNew = Math.abs(date2 - date1) + 1;

        const diffDays = Math.ceil(diffTimeNew / (1000 * 60 * 60 * 24));


        const timeDiff = this.dateDifference(`${start_date} ${start_time}`,`${end_date} ${end_time}`,"hours");


        AllDates = Array.from({ length: diffDays }, (_, i) =>
          moment(start_date).add(i, "days").format("YYYY-MM-DD")
        );

        let temp_Days = Array.from({ length: diffDays },(_, i) => Number(moment(start_date).add(i, "days").format("d")) + 1);

        let job_dates = temp_Days.filter(function (obj) {
          return days.indexOf(obj) !== -1;
        });

        let datesArray = temp_Days.map(function (obj,i) {
          return days.indexOf(obj) !== -1 ? AllDates[i] : false;
        }).filter(x => x);


        let temp_multiple_date = values.multiple_dates;
        temp_multiple_date[index]["job_dates"] = datesArray;

        setFieldValue("multiple_dates", temp_multiple_date);
        total_recommended_rate = Number((parseFloat(total_recommended_rate) + parseFloat( (timeDiff *(rate_per_hour || 0) *number_of_provider *job_dates.length).toFixed(2))).toFixed(2));

      });
      setFieldValue("recommended_rate", total_recommended_rate);
    });
  };


  handleError(values){
       if(values?.start_date === "" || values?.start_date === undefined){
      this.props.actions.setredux("Please select start date", "error_message",actionTypes.ERROR_MESSAGE);
      return false
    }
    if(values?.start_time === "" || values?.start_time === undefined){
      this.props.actions.setredux("Please select start time", "error_message",actionTypes.ERROR_MESSAGE);
      return false
    }
    if(values?.end_date === "" || values?.end_date === undefined){
      this.props.actions.setredux("Please select end date", "error_message",actionTypes.ERROR_MESSAGE);
      return false
    }
    if(values?.end_time === "" || values?.end_time === undefined){
      this.props.actions.setredux("Please select end time", "error_message",actionTypes.ERROR_MESSAGE);
      return false
    }
    if(values?.days[0] === [] || values?.days[0] === undefined){
      this.props.actions.setredux("Please select days", "error_message",actionTypes.ERROR_MESSAGE);
      return false
    }
    return true
  }

   handleAdd = (values,setFieldValue) => {
    values.multiple_dates.every((lastData,index) => {
        if (this.handleError(lastData)) {
            if( ( values.multiple_dates.length - 1=== index)){
                const temp = values.multiple_dates;
                 if(values.multiple_dates.map((x) =>x.box_id).length +1 > values.number_of_provider) {
                    this.props.actions.setredux(
                           "Number of provider is" + " " + values.number_of_provider + " so you can't add more shift", "error_message",
                      actionTypes.ERROR_MESSAGE
                    );
                }else{
                    temp.push({
                        start_date: moment().format("MMM DD, YYYY"),
                        end_date: moment().format("MMM DD, YYYY"),
                        start_time: "",
                        end_time: "",
                        days: [],
                        box_id: "",
                        select: false,
                        job_dates: [],
                      });

                      try{
                        setTimeout(() => {
                            document.documentElement.scrollTop = document.getElementById("multiple_dates").offsetTop + document.getElementById(`date-box-${index}`).offsetTop + 50
                        }, 100)
                      }
                      catch(e){
                        console.log("error", e)
                      }
                      setFieldValue("multiple_dates", temp);
                      this.setState({ multiple_dates: temp });

                    }
                  }else{
                    return true;
            }
        }else{
            return false;
        }
    })
  }


  handleRemove(i, values) {
    const temp = values.multiple_dates;
    temp.splice(i, 1);
    this.setState({ multiple_dates: temp });

  }

  handleChangeSelectBox(idx, field,values, setFieldValue) {
    const tempData = values.multiple_dates;
    let current_pro_id = this.state?.currentProvider?.value;
    let boxId = field.id;
    let temp_pro_box = this.state.provider_box;
    let current_pro_index = this.state.provider_box.findIndex(x => x.provider_id === current_pro_id)
     if(current_pro_index > -1) {
         let is_include =  temp_pro_box[current_pro_index]?.box_id.includes(boxId);
         if(is_include > -1) {
           temp_pro_box[current_pro_index]?.box_id.splice(is_include,1);
           temp_pro_box[current_pro_index]?.box_id.push(boxId)
        }
     }else{
        temp_pro_box.push({  provider_id:current_pro_id,  box_id:[boxId]  })
     }
     tempData.map((x, index) => {
      if (index === idx) {
        x.select = true;
      } else {
        x.select = false;
      }
      setFieldValue("provider_box",temp_pro_box)
      setFieldValue("multiple_dates", tempData);
    });
  }

  handleMultipleChangeSelectBox(idx, values, setFieldValue,field) {
    const tempData = values.multiple_dates;

    let current_pro_id = this.state?.currentProvider?.value;
    let boxId = field.id;
    let temp_pro_box = this.state.provider_box;
    const temp_data = this.state.provider_box;
    const findProvider = temp_data.find(i => i.provider_id === current_pro_id)

    if(!!findProvider) {
      let boxes = findProvider?.box_id || []
      if(boxes.includes(boxId)) {
        boxes = boxes.filter(id => id !== boxId )
      }else {
        boxes = [...boxes, boxId]
      }
      this.state.provider_box.forEach((i) => {
        if(i.provider_id ===findProvider.provider_id ) {
          i.box_id = [...boxes]
        }
      })

    }else {
      this.state.provider_box = [...this.state.provider_box, {
        provider_id : current_pro_id,
        box_id: [boxId]
      }]
    }
    setFieldValue("provider_box",temp_pro_box)
    setFieldValue("multiple_dates", tempData);
  }

  handleAddBoxValidation() {
    let temp = this.state.provider_box.map((x) => x.box_id)
    let data = [].concat.apply([], temp)
    if(data.length === 0){
      this.props.actions.setredux(
            "Please select at least one job-shift" + " ",
            "error_message",
            actionTypes.ERROR_MESSAGE
          )
    }else{
      this.setState({["infoDialog"] : false})
    }
  }

  toggleTab(tab, isFromButton) {
    if (this.state.activeTab !== tab) {
      if (tab >= 0 && tab <= 2) {
        let modifiedSteps = [...this.state.passedSteps, tab];
        this.setState({
          activeTab: tab,
          passedSteps: modifiedSteps,
        });
      }
    }
  }

  handleChangeState(event, setFieldValue, values) {
    const { name, value } = event.target;
    this.setState({
      ...this.state,
      data: { ...this.state.data, [name]: value },
    });
    if (Number(event.target.value) === 0) {
      setFieldValue("provider_id",values.provider_id.filter((x) => x.is_req_send_by_provider === 1) || []);
      setFieldValue("is_post_visible",value);
    } else if (Number(event.target.value) === 1) {
      setFieldValue("provider_id",values.provider_id.filter((x) => x.is_req_send_by_provider === 1) || []);
      setFieldValue("is_post_visible",value);
    }
  }

  handleSelectChange(name, value) {
    this.setState({
      ...this.state,
      data: { ...this.state.data, [name]: value },
    });
  }

  handleChangeCheckBox() {
    this.setState(
      (prevState) => ({ selected: !prevState.selected }),
      () => this.props.onOptionChange(this.props.option, this.state.selected)
    );
  }

  dateDifference = (startDateTime, endDateTime, isFrom) => {

    let numDays = 0;
    if (isFrom === "date") {
      const dateCurrentTime = moment(
        moment(endDateTime).format("MMM DD, YYYY") + "T00:00:00Z"
      );
      const dateStartTime = moment(
        moment(startDateTime).format("MMM DD, YYYY") + "T00:00:00Z"
      );
      numDays = Math.ceil(dateCurrentTime.diff(dateStartTime, "days", false));
    } else if (isFrom === "allHours") {
      const dateCurrentTime = moment(endDateTime);
      const dateStartTime = moment(startDateTime);
      numDays = dateCurrentTime.diff(dateStartTime, "hours", true);
    } else {
      const dateCurrentTime = moment(
        moment().format("MMM DD, YYYY") +
          " " +
          moment(endDateTime).format("HH:mm")
      );
      const dateStartTime = moment(
        moment().format("MMM DD, YYYY") +
          " " +
          moment(startDateTime).format("HH:mm")
      );
      numDays = dateCurrentTime.diff(dateStartTime, "hours", true);
        if(numDays <= 0){
            numDays = 24 + numDays;
        }
    }
    return numDays;
  };

  handleSearch(place, setFieldValue) {
    geocodeByAddress(place)
    .then((results) => {
      var a = place.address_components.find((x) => x.types.includes("locality"));
      var b = place.address_components.find((x) =>
        x.types.includes("administrative_area_level_3")
      );
      var c = place.address_components.find((x) =>
        x.types.includes("administrative_area_level_2")
      );
      var d = place.address_components.find((x) =>
        x.types.includes("administrative_area_level_1")
      );
      var e = place.address_components.find((x) =>
        x.types.includes("postal_code")
      );
      setFieldValue("location", a?.long_name || "");
      setFieldValue("street_address", b?.long_name || "");
      setFieldValue("city", c?.long_name || "");
      setFieldValue("state", d?.long_name || "");
      setFieldValue("zipcode", e?.long_name || "");
    })
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.GetAllJobCategory &&
      !(JSON.stringify(prevProps) === JSON.stringify(this.props))
    ) {
      const { GetAllJobCategory } = this.props;
      let options = [];
      if (GetAllJobCategory && GetAllJobCategory.data) {
        options = GetAllJobCategory.data.map((x) => {
          return { value: x.id, label: x.title };
        });
        this.setState({ options: options });
      }
    }
  }

  prevStep = (setErrors) => {
    this.toggleTab(this.state.activeTab - 1, "prev");
    setErrors({});
  };

  submitJob = async (values) => {
    try {
      this.props.actions.SetLoader(true);
      const { user_id, company_id, id, parent_job_id } = this.state.data;
      const {provider_box,oldData} = this.state;

      let payload = {
        type: "postJobAdmin",
        parent_job_id: parent_job_id,
        user_id: user_id,
        company_id: company_id,
        title: values.title,
        expertise: values.expertise.map((x) => x.value),
        description: values.description,
        is_auto_job_assign: Number(values.is_auto_job_assign),
        location: values.location,
        is_post_visible: Number(values.is_post_visible),
        street_address: values.street_address,
        city: values.city,
        state: values.state,
        zipcode: values.zipcode,
        provider_box,
        payment_mode: Number(values.payment_mode),
        number_of_provider: Number(values.number_of_provider),
        recommended_rate: Number(values.recommended_rate),
        provider_id: values.provider_id.map((x) => x.value),
        multiple_dates: values.multiple_dates.map((x,index) => {

          let tempOldData =  oldData.find(i => i.id === x.id) || {};
          tempOldData.days = tempOldData?.days?.sort();
          let tempNewData =  x
          tempNewData.days = tempNewData.days.sort();
          return {
            start_date: moment(x.start_date).format("YYYY-MM-DD"),
            end_date: moment(x.end_date).format("YYYY-MM-DD"),
            start_time: moment(x.start_date + " " + x.start_time).format(
              "HH:mm"
            ),
            end_time: moment(x.end_date + " " + x.end_time).format("HH:mm"),
            box_id: x.id || 0,
            job_dates: x.job_dates,
            days: x.days,
            is_update_box:!_.isEqual(tempNewData , tempOldData)
          };
        }),
        no_of_year: values.years_of_experience,
        payment_city: values.cityy,
        user_type: values.provider_type,
        backup_provider_id: values.backup_provider_id.map((x) => x.value),
      };

      if (
        this.props.isFrom === "New Job" ||
        this.props.isFrom === "In-Progress Job"
      ) {
        payload.job_id = id;
      } else {
        payload.id = id;
      }
      if (this.props.isFrom === "In-Progress Job") {
        payload.is_inprogress_job = 1;
      } else if (this.props.isFrom === "New Job") {
        payload.is_inprogress_job = 0;
      }
      if (!payload.payment_mode)
        payload.rate_per_hour = Number(values.rate_per_hour);

      const jobPaymentArray = [
        ...this.props.paymentMode,
        this.props.t("All Records"),
      ];
      const paymentTypeDropDown = jobPaymentArray[0];
      let that = this;

      const response = await postData(GetAllProviderSearchByName, payload)
        .then((response) => {
          that.props.actions.SetLoader(false);
          if (response.data.statuscode === 200) {
            that.props.actions.setredux(
              response.data.message,
              "success_message",
              SUCCESS_MESSAGE
            );
            that.props.actions.SetLoader(false);
            that.props.onClose();

            const newJobPayload = {
              type: "getAllJobPostAdmin",
              payment_type: jobPaymentArray.indexOf(paymentTypeDropDown),
            };
            that.props.actions.SetLoader(true);

            that.props.actions.postAll(
              GetAllJobPostAdmin,
              newJobPayload,
              "GetAllJobPostAdmin"
            );
          }
        })
        .catch((error) => {
          that.props.actions.SetLoader(false);
          that.props.actions.setredux(
            error.response?.message || "network error",
            "error_message",
            ERROR_MESSAGE
          );
        });
    } catch (error) {
      console.log(error);
      this.props.actions.setredux(
        error?.message || "network error",
        "error_message",
        ERROR_MESSAGE
      );
      this.props.actions.SetLoader(false);
    }
  };

  handleTempStateChange = (mainState, innerState, value) => {
    this.setState((prevState) => ({
      ...prevState,
      [mainState]: { ...prevState[mainState], [innerState]: value },
    }));
  };

  nextStep = (props,values) => {
    let result = true;
       if (this.props.isFrom === "In-Progress Job" && this.state.activeTab === 1) {
      let provider_number =
        props.values.provider_id.filter((x) => x.is_assigned === 1).length <=
          props.values.number_of_provider &&
        props.values.provider_id.filter((x) => x.is_assigned === 1).length >=
          props.values.number_of_provider;
      result = provider_number;
    }
    if (result) {
      props
        .submitForm()
        .then(() => {
          if (props.isValid) {
            const tab = this.state.activeTab + 1;
            this.toggleTab(tab, "next");
            props.validateForm();
            props.setTouched({});
            if (tab === 3) {
             this.submitJob(props.values);
            }
          }
        })
        .catch((e) => {});
    } else {
      if (
        props.values.is_post_visible === 0 && props.values.provider_id.filter((x) =>   x.is_assigned === 1 && x.is_req_send_by_provider === 1 ).length <=
        props.values.number_of_provider
      ) {
        this.props.actions.setredux(
          "Primary provider cannot be less than" +
            " " +
            props.values.number_of_provider,
          "error_message",
          actionTypes.ERROR_MESSAGE
        );
      }

     else if (
      props.values.is_post_visible === 1 && props.values.provider_id.filter((x) => x.is_assigned === 1 && x.is_req_send_by_provider === 0).length <=
        props.values.number_of_provider
      ) {
        this.props.actions.setredux(
          "Requester provider not less than" +
            " " +
            props.values.number_of_provider,
          "error_message",
          actionTypes.ERROR_MESSAGE
        );
      }
      else if (
        props.values.provider_id.filter((x) => x.is_assigned === 1).length >=
        props.values.number_of_provider
      ){
        this.props.actions.setredux(
          "Primary provider cannot be greater than" +
            " " +
            props.values.number_of_provider,
          "error_message",
          actionTypes.ERROR_MESSAGE
        );
      }
        else if(props?.values?.multiple_dates.find((x) => x.start_time === "")){
          this.props.actions.setredux(
            "Please select start time",
            "error_message",
            actionTypes.ERROR_MESSAGE
          );
        }
        else if(props?.values?.multiple_dates.filter((x) => x.end_time === "")){
          this.props.actions.setredux(
            "Please select end time",
            "error_message",
            actionTypes.ERROR_MESSAGE
          );
        }
        else if(props?.values?.multiple_dates.filter((x) => x.days === [])){
          this.props.actions.setredux(
            "Please select days",
            "error_message",
            actionTypes.ERROR_MESSAGE
          );
        }

    }
  };

  handleSubmit = (values, formikbag) => {
    setTimeout(() => {
      formikbag.setSubmitting(false);
    }, 1000);
  };

  handlePaymentMode(isFrom, setFieldValue, values) {
    if (isFrom === 0) {
      setFieldValue("payment_mode", 0);
      setFieldValue(
        "start_date",
        this.state["multiple_dates"].temp_start_date ||
          this.state.multiple_dates.start_date
      );
      setFieldValue(
        "end_date",
        this.state["multiple_dates"].temp_end_date ||
          this.state.multiple_dates.end_date
      );
      setFieldValue(
        "start_time",
        this.state["multiple_dates"].temp_start_time ||
          this.state.multiple_dates.start_time
      );
      setFieldValue(
        "end_time",
        this.state["multiple_dates"].temp_end_time ||
          this.state.multiple_dates.end_time
      );
      setFieldValue(
        "number_of_provider",
        this.state["multiple_dates"].number_of_provider ||
          this.state.data.number_of_provider
      );
      this.handleCalculateRate(setFieldValue, {
        ...values,
        payment_mode: 0,
        start_time:
          this.state["multiple_dates"].temp_start_time ||
          this.state.multiple_dates.start_time,
        end_time:
          this.state["rate_per_hour"].temp_end_time ||
          this.state.multiple_dates.end_time,
      });
    } else {
      setFieldValue("payment_mode", 1);
      setFieldValue(
        "recommended_rate",
        this.state["fixed_rate"].recommended_rate || ""
      );
      setFieldValue(
        "start_date",
        this.state["fixed_rate"].temp_start_date || new Date()
      );
      setFieldValue(
        "end_date",
        this.state["fixed_rate"].temp_end_date || new Date()
      );
      setFieldValue(
        "start_time",
        this.state["fixed_rate"].temp_start_time || ""
      );
      setFieldValue("end_time", this.state["fixed_rate"].temp_end_time || "");
      setFieldValue(
        "number_of_provider",
        this.state["fixed_rate"].number_of_provider || ""
      );
    }
  }


  getDate = (values) => {
    const dateDiff = this.dateDifference(
    values,
    moment().format("MMM DD, YYYY"),
    "date"
    );
    if (dateDiff >= 0) return new Date();
    else
    return new Date(moment(values, "MMM DD, YYYY").toISOString());
    }

  step1 = (props) => {
    const {
      values,
      handleChange,
      handleBlur,
      setFieldValue,
      setFieldTouched,
      errors,
      touched,
    } = props;

    if (this.state.activeTab === 0) {
      return (
        <TabPane tabId={0}>
          <Row>
            <Col lg="6" className="mb-2">
              <Label htmlFor="example-text-input-name">Title</Label>
              <input
                id="example-text-input-name"
                className="form-control"
                type="text"
                value={values.title}
                placeholder="title"
                name="title"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage className="error" name="title" component="div" />
            </Col>
            <Col lg="6" className="mb-2">
              <Label htmlFor="basicpill-lastname-input2">
                Expertise / Skill Set
              </Label>
              <ExpertiseSelect
                name="expertise"
                options={this.state.options}
                value={values.expertise}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                error={errors.expertise}
                touched={touched.expertise}
              />
            </Col>
            <Col lg="12" className="mb-2">
              <Label htmlFor="example-text-input-name">Description</Label>
              <input
                name="description"
                id="example-text-input-name"
                className="form-control"
                type="textarea"
                value={values.description}
                placeholder="Details about the job comes here..."
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="error mt-2"
                name="description"
                component="div"
              />
            </Col>
            <Col lg="12" className="mb-2">
              <div className="mt-3">
                <input
                  name="is_auto_job_assign"
                  type="checkbox"
                  id="customSwitch1"
                  checked={values.is_auto_job_assign}
                  onChange={handleChange}
                />
                &nbsp; Auto Assign
              </div>
            </Col>
            <Col lg="12" className="mb-2">
              <h6 className="text-danger">
                <strong>Note :</strong> If auto-assign is selected, the job will be assigned
                to the provider who accept it.
              </h6>
            </Col>
          </Row>
          <div className="actions d-flex flex-row justify-content-end">
            <Button
              type="button"
              color="primary"
              className="ml-2"
              onClick={() => this.nextStep(props)}
            >
              Next
            </Button>
          </div>
        </TabPane>
      );
    }
  };
  step2 = (props) => {
    if (this.state.activeTab === 1) {
      const {
        values,
        handleChange,
        handleBlur,
        setFieldValue,
        setFieldTouched,
        setErrors,
        errors,
        touched,
      } = props;
      return (
        <div>
          <TabPane tabId={1}>
            <Row>

              <Col lg="12">
                <LocationSearchInput
                  setFieldValue={setFieldValue}
                />
              </Col>

              <Col lg="6" className="mb-2">
                <Label htmlFor="example-text-input-name">
                  Location Details
                </Label>
                <input
                  id="example-text-input-name"
                  className="form-control"
                  type="text"
                  value={values.location}
                  placeholder="Location Details"
                  name="location"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage
                  className="error"
                  name="location"
                  component="div"
                />
              </Col>

              <Col lg="6" className="mb-2">
                <Label htmlFor="example-text-input-name"> Street Address</Label>
                <input
                  id="example-text-input-name"
                  className="form-control"
                  type="text"
                  value={values.street_address}
                  placeholder="Street Address"
                  name="street_address"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage
                  className="error"
                  name="street_address"
                  component="div"
                />
              </Col>

              <Col lg="6" className="mb-2">
                <Label htmlFor="example-text-input-name"> City</Label>
                <input
                  id="example-text-input-name"
                  className="form-control"
                  type="text"
                  value={values.city}
                  placeholder="City"
                  name="city"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage className="error" name="city" component="div" />
              </Col>

              <Col lg="6" className="mb-2">
                <Label htmlFor="example-text-input-name"> State </Label>
                <input
                  id="example-text-input-name"
                  className="form-control"
                  type="text"
                  value={values.state}
                  placeholder="State"
                  name="state"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage className="error" name="state" component="div" />
              </Col>

              <Col lg="6" className="mb-2">
                <Label htmlFor="example-text-input-name"> Zip Code </Label>
                <input
                  id="example-text-input-name"
                  className="form-control"
                  maxLength="6"
                  type="number"
                  value={values.zipcode}
                  placeholder="Zip Code"
                  name="zipcode"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage
                  className="error"
                  name="zipcode"
                  component="div"
                />
              </Col>


              <Col lg="6" className="mb-2">
                <Label htmlFor="example-text-input-name"> Visibility </Label>
                <select
                  className="form-control"
                  name="is_post_visible"
                  value={values.is_post_visible}
                  onChange={(e) => {
                    handleChange(e);
                    this.handleChangeState(e, setFieldValue, values);
                  }}
                  disabled={this.props.isFrom === "In-Progress Job"}
                >
                  <option value="" disabled>
                    Select user
                  </option>
                  <option value="0">IPS Users</option>
                  <option value="1">Request Users</option>
                </select>
                <ErrorMessage
                  className="error"
                  name="is_post_visible"
                  component="div"
                />
              </Col>
              {( ( this.props.location.pathname === "/new-jobs" ? values.provider_id.length > 0 : values.provider_id.length >= 0 &&
                this.state.temp.length > 0 &&
                Number(this.state.data.is_post_visible) === 0) ||
                Number(this.state.data.is_post_visible) === 1) && (
                <Col lg="12">
                  <FormGroup className="mb-3">
                    <AsyncSelect
                      id="example-text-input-name"
                      name="provider_id"
                      placeholder="Add Provider"
                      hideSelectedOptions
                      isMulti
                      cacheOptions
                      value={
                        (this.props.isFrom === "New Job" &&
                          values.provider_id) ||
                        (this.props.isFrom === "In-Progress Job" &&
                          values.provider_id.filter((x) => x.is_assigned === 1))
                      }
                      onChange={(value,i) => {
                        if (Number(this.state.data.is_post_visible) === 0) {
                          value = value?.map((x) => ({
                            ...x,
                            is_req_send_by_provider: 1,
                          })) || [];
                          setFieldValue("provider_id", value || []);
                          this.setState({
                            ...this.state,
                            ["temp"]: value || [],
                            ["infoDialog"]: value?.length < values?.provider_id?.length ?  false : true,
                          });

                          if(value?.length < values?.provider_id.length){
                                  let removePro =values.provider_id.filter((x,i) => value.findIndex(y=> y.value === x.value) === -1 ? true: false)[0];
                                  this.setState({
                                   ...this.state,
                                  ["currentProvider"]: removePro  || null,
                                  ["infoDialog"]: value?.length < values?.provider_id.length ?  false : true,
                                  });
                              }else{
                                  let addPro= value?.filter((x,i) => values?.provider_id.findIndex(y=> y.value === x.value) === -1 ? true: false)[0];
                                  this.setState({
                                  ...this.state,
                                  ["currentProvider"]: addPro || null,
                                  ["infoDialog"]: value?.length < values?.provider_id.length ? false : true,
                        });
                        }} else if (
                          Number(this.state.data.is_post_visible) === 1) {
                          value = value?.map((x) => ({...x})) || [];
                          setFieldValue("provider_id", value || []);
                          this.props.location.pathname === "/inprogress-jobs"  && this.setState({
                                  ...this.state,
                                  ["infoDialog"]: value?.length < values?.provider_id.length ? false : true,
                        });
                        if(this.props.location.pathname === "/inprogress-jobs" && value?.length < values?.provider_id.length){
                                  let removePro =values?.provider_id.filter((x,i) => value.findIndex(y=> y.value === x.value) === -1 ? true: false)[0];
                                  this.props.location.pathname === "/inprogress-jobs" && this.setState({
                                   ...this.state,
                                  ["currentProvider"]: removePro || null,
                                  ["infoDialog"]: value?.length < values?.provider_id.length ?  false : true,
                                  });
                              }else{
                                  let addPro= value?.filter((x,i) => values?.provider_id.findIndex(y=> y.value === x.value) === -1 ? true: false)[0];
                                  this.props.location.pathname === "/inprogress-jobs" && this.setState({
                                  ...this.state,
                                  ["currentProvider"]: addPro || null,
                                  ["infoDialog"]: value?.length < values?.provider_id.length ? false : true,
                        });
                        }}}}
                      error={errors.provider_id}
                      touched={touched.provider_id}
                      loadOptions={(inputValue) =>
                        this.loadOptions(inputValue, values)
                      }
                    />
                    <ErrorMessage
                      className="error"
                      name="provider_id"
                      component="div"
                    />
                  </FormGroup>
                </Col>
              )}

              <Col lg="12">
                <Label htmlFor="example-text-input-name">
                  Backup Providers (Optional)
                </Label>
                <FormGroup className="mb-3">
                  <AsyncSelect
                    name="backup_provider_id"
                    placeholder="Add Backup Provider"
                    hideSelectedOptions
                    isMulti
                    cacheOptions
                    value={values.backup_provider_id}
                    onChange={(value) => {
                      setFieldValue("backup_provider_id", value || []);
                    }}
                    error={errors.backup_provider_id}
                    touched={touched.backup_provider_id}
                    loadOptions={(inputValue) =>
                      this.backupProviderLoadOptions(inputValue, values)
                    }
                  />
                </FormGroup>
              </Col>
            </Row>

            <div className="actions d-flex flex-row justify-content-end">
              <Button
                type="button"
                color="primary"
                onClick={() => this.prevStep(setErrors)}
              >
                Previous
              </Button>
              <Button
                type="button"
                color="primary"
                className="ml-2"
                onClick={() => this.nextStep(props)}
              >
                Next
              </Button>
            </div>
          </TabPane>
          <div >
            {this.state.infoDialog && (
              <div className="popup custom-popup">
              <commonMethods.RenderSweetAlert
                CustomButton={
                  <>
                   <Button className="add-button-new"
                   style={{marginLeft:"45%"}}
                    onClick={() =>this.handleAddBoxValidation()}>
                      Add
                    </Button>
                  </>
                }
                Body={(renderProps) => (
                  <>
                    <AvForm
                      id="create-course-form"
                      className="needs-validation"
                    >
                    <span style={{color:"#094e89",fontSize:"20px"}}>Select Shift</span>
                    <br />
                      <div className="product-delete-text-wrapper-new">
                          <Col lg="12" name={"multiple_dates"} className="days_list ">
                            {values.multiple_dates.map((field, idx) => {
                              return (
                                <div
                                  key={`${field}-${idx}`}
                                  className={`${
                                    (this.props.location.pathname === "/new-jobs" ?  (this.state.provider_box.find(box => box.provider_id === this.state?.currentProvider?.value)?.box_id?.includes(field.id)) :field.select )
                                      ? "select-box-new "
                                      : "disable-box-new "
                                  }`}
                                  onClick={() => this.props.location.pathname === "/inprogress-jobs" ? this.handleChangeSelectBox(idx,field,values,setFieldValue) : this.handleMultipleChangeSelectBox(idx,values,setFieldValue,field)}
                                >
                                  <Row lg="12" className={`${
                                    (this.props.location.pathname === "/new-jobs" ?  this.state.provider_box.find(box => box.provider_id === this.state?.currentProvider?.value)?.box_id?.includes(field.id) :field.select)
                                  ? "select-box-dy" : "add-border mb-2" }`}>


                                    <Col lg="6" className="mb-2 mt-3">
                                      <Label htmlFor="example-text-input-name">
                                        Start Date{" "}
                                      </Label>
                                      <DatePickerFeildNew
                                        name="start_date"
                                        index={idx}
                                        placeholder="Start Date"
                                        minDate={new Date()}
                                        handleCalculateRate={
                                          this.handleCalculateRate
                                        }
                                        handleTimeChange={this.handleTimeChange}
                                        value={field.start_date}
                                        values={values}
                                      />
                                      <ErrorMessage
                                        className="error"
                                        name="start_date"
                                        component="div"
                                      />
                                    </Col>
                                    <Col lg="6" className="mb-2 mt-3">
                                      <Label htmlFor="example-text-input-name">
                                        {" "}
                                        End Date{" "}
                                      </Label>
                                      <DatePickerFeildNew
                                        name="end_date"
                                        index={idx}
                                        placeholder="End Date"
                                        minDate={this.getDate(field.start_date)}
                                        handleCalculateRate={
                                          this.handleCalculateRate
                                        }
                                        handleTimeChange={this.handleTimeChange}
                                        value={field.end_date}
                                        values={values}
                                      />
                                      <ErrorMessage
                                        className="error"
                                        name="end_date"
                                        component="div"
                                      />
                                    </Col>
                                    <Col lg="6" className="mb-2 mt-2">
                                      <Label>Start Time</Label>
                                      <DatePickerFeildNew
                                        name="start_time"
                                        index={idx}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={30}
                                        timeCaption="Time"
                                        dateFormat="hh:mm"
                                        placeholder="Start Time"
                                        rateChange
                                        values={values}
                                        handleTimeChange={this.handleTimeChange}
                                        handleCalculateRate={
                                          this.handleCalculateRate
                                        }
                                        value={field.start_time}
                                      />
                                      <ErrorMessage
                                        className="error"
                                        name="start_time"
                                        component="div"
                                      />
                                    </Col>
                                    <Col lg="6" className="mb-2 mt-2">
                                      <Label>End Time</Label>
                                      <DatePickerFeildNew
                                        name="end_time"
                                        index={idx}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={30}
                                        timeCaption="Time"
                                        dateFormat="hh:mm"
                                        placeholder="End Time"
                                        values={values}
                                        rateChange
                                        handleCalculateRate={
                                          this.handleCalculateRate
                                        }
                                        handleTimeChange={this.handleTimeChange}
                                        value={field.end_time}
                                      />
                                      <ErrorMessage
                                        className="error"
                                        name="end_time"
                                        component="div"
                                      />
                                    </Col>
                                    <Col
                                      lg="12"
                                      className="mb-2 mt-2 ml-1 days_list"
                                    >
                                      {days.map((name, index) => {
                                        return (
                                          <div className="days_cs">
                                            <input
                                              type="checkbox"
                                              id={`custom-checkbox-${index}`}
                                              value={field.days[index]}
                                              checked={field.days.includes(
                                                index
                                              )}
                                              onChange={() =>
                                                this.handleDaysChange(
                                                  index,
                                                  values,
                                                  idx,
                                                  setFieldValue
                                                )
                                              }
                                              disabled={true}
                                            />
                                            &nbsp;
                                            <label key={index}>{name}</label>
                                          </div>
                                        );
                                      })}
                                      <ErrorMessage
                                        className="error"
                                        name="days"
                                        component="div"
                                      />
                                    </Col>
                                  </Row>
                                </div>
                              );
                            })}
                          </Col>
                      </div>
                    </AvForm>
                  </>
                )}
              />
              </div>
            )}
          </div>
        </div>
      );
    }
  };

  step3 = (props) => {
    if (this.state.activeTab === 2) {
      const {
        values,
        handleChange,
        handleBlur,
        setFieldValue,
        setFieldTouched,
        errors,
        setErrors,
      } = props;

      return (
        <TabPane tabId={2}>
          <Row>
            <Col lg="12" style={{textAlign:"center" ,marginBottom:"15px"}}>
              <h5 style={{color:"black"}}>Choose Time Requirement</h5>
            </Col>
            {values.payment_mode === 0 && (
              <Col lg="6" className="mb-2">
                <Label htmlFor="example-text-input-name">
                  Experience Level
                </Label>
                <select
                  className="form-control"
                  name="years_of_experience"
                  onChange={(e) => {
                    handleChange(e);
                    setFieldValue(
                      "rate_per_hour",
                      getRatePerHour(
                        e.target.value,
                        values.cityy,
                        values.provider_type
                      )
                    );
                    this.handleCalculateRate(setFieldValue, {
                      ...props.values,
                      rate_per_hour: getRatePerHour(
                        e.target.value,
                        values.cityy,
                        values.provider_type
                      ),
                    });
                  }}
                  placeholder="Years of experience"
                  value={values.years_of_experience}
                  onBlur={handleBlur}
                  disabled={this.props.isFrom === "In-Progress Job"}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  {priceData.map((data) => (
                    <option value={data.noOfExperience}>
                      {data.noOfExperience}
                    </option>
                  ))}
                </select>
                <ErrorMessage
                  className="error"
                  name="years_of_experience"
                  component="div"
                />
              </Col>
            )}
            {values.payment_mode === 0 && (
              <Col lg="6" className="mb-2">
                <Label htmlFor="example-text-input-name"> State </Label>
                <select
                  className="form-control"
                  name="cityy"
                  onChange={(e) => {
                    handleChange(e);

                    const getPriceData = priceData
                      .find(
                        (data) =>
                          data.noOfExperience === values.years_of_experience
                      )
                      .CityData.find(
                        (cityData) => cityData.city === e.target.value
                      ).PriceData;

                    const newProviderType =
                      getPriceData.find(
                        (priceData) =>
                          priceData.personType === values.provider_type
                      )?.personType || getPriceData[0].personType;

                    setFieldValue("provider_type", newProviderType);

                    setFieldValue(
                      "rate_per_hour",
                      getRatePerHour(
                        values.years_of_experience,
                        e.target.value,
                        newProviderType
                      )
                    );
                    this.handleCalculateRate(setFieldValue, {
                      ...props.values,
                      rate_per_hour: getRatePerHour(
                        values.years_of_experience,
                        e.target.value,
                        newProviderType
                      ),
                    });
                  }}
                  placeholder="State"
                  value={values.cityy}
                  onBlur={handleBlur}
                  disabled={this.props.isFrom === "In-Progress Job"}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  {priceData
                    .find(
                      (data) =>
                        data.noOfExperience === values.years_of_experience
                    )
                    ?.CityData.map((city) => (
                      <option value={city.city}>{city.city}</option>
                    )) || []}
                </select>
                <ErrorMessage className="error" name="cityy" component="div" />
              </Col>
            )}
            {values.payment_mode === 0 && (
              <Col lg="6" className="mb-2">
                <Label htmlFor="example-text-input-name">Provider Type</Label>
                <select
                  className="form-control"
                  name="provider_type"
                  onChange={(e) => {
                    handleChange(e);
                    setFieldValue(
                      "rate_per_hour",
                      getRatePerHour(
                        values.years_of_experience,
                        values.cityy,
                        e.target.value
                      )
                    );
                    this.handleCalculateRate(setFieldValue, {
                      ...props.values,
                      rate_per_hour: getRatePerHour(
                        values.years_of_experience,
                        values.cityy,
                        e.target.value
                      ),
                    });
                  }}
                  placeholder="State"
                  value={values.provider_type}
                  onBlur={handleBlur}
                  disabled={this.props.isFrom === "In-Progress Job"}
                >
                  <option value="" selected disabled>
                    Select
                  </option>
                  {priceData
                    .find(
                      (data) =>
                        data.noOfExperience === values.years_of_experience
                    )
                    ?.CityData.find((city) => city.city === values.cityy)
                    ?.PriceData.map((personData) => (
                      <option value={personData.personType}>
                        {personData.personType}
                      </option>
                    )) || []}
                </select>
                <ErrorMessage
                  className="error"
                  name="provider_type"
                  component="div"
                />
              </Col>
            )}
            {values.payment_mode === 0 && (
              <Col lg="6" className="mb-2">
                <Label htmlFor="example-text-input-name"> Rate Per Hour </Label>
                <input
                  id="example-text-input-name"
                  className="form-control"
                  type="text"
                  disabled={values.payment_mode === 0}
                  value={values.rate_per_hour}
                  placeholder="Rate per hour"
                  n
                  ame="rate_per_hour"
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  onBlur={handleBlur}
                />
                <ErrorMessage
                  className="error"
                  name="rate_per_hour"
                  component="div"
                />
              </Col>
            )}

            {values.payment_mode === 0 && (
              <Col lg="6" className="mb-2">
                <Label htmlFor="example-text-input-name">
                  {" "}
                  Number Of Provider{" "}
                </Label>
                <input
                  id="example-text-input-name"
                  className="form-control"
                  type="text"
                  value={values.number_of_provider}
                  placeholder="No Of Provider"
                  name="number_of_provider"
                  onChange={(e) => {
                    handleChange(e);
                    this.handleCalculateRate(setFieldValue, {
                      ...props.values,
                      number_of_provider: +e.target.value,
                    });
                  }}
                  onBlur={handleBlur}
                  disabled={this.props.isFrom === "In-Progress Job"}
                />
                <ErrorMessage
                  className="error"
                  name="number_of_provider"
                  component="div"
                />
              </Col>
            )}
            <Col lg="6" className="mb-2">
              <Label htmlFor="example-text-input-name">Recommended Rate</Label>
              <input
                id="example-text-input-name"
                className="form-control"
                type="text"
                disabled={values.payment_mode === 0}
                value= {`$${values.recommended_rate}`}
                placeholder="Recommended Rate"
                name="recommended_rate"
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="error"
                name="recommended_rate"
                component="div"
              />
            </Col>
            <Col lg="12" className="add-more-stock-wrapper">
              <img
                className="mb-1 cur-point"
                style={{ marginRight: "6px" }}
                src={IconAdd}
                alt="add"
                onClick={() => {this.handleAdd(values,setFieldValue)}}
                ref={this.myRef}
              />
              <span>{this.props.t("Add More")}</span>
            </Col>
            <Col name={"multiple_dates"} id="multiple_dates">
              {values.multiple_dates.map((field, idx) => {
                let boxId = field.box_id;
                return (
                  <div
                  id={`date-box-${idx}`}
                    key={`${field}-${idx}`}
                    className={`${field.select ? "select-box" : "disable-box"}`}
                  >
                    <Row
                      lg="12"
                      className={`${
                        field.select ? "select-box-dy" : "add-border mb-2"
                      }`}
                    >

                      <Col lg="12" className="remove-size-stocks remove-icon">
                        {(idx > 0 || (errors && errors === idx)) && (
                          <div className="remove-size-stocks">
                            {this.props.location.pathname === "/new-jobs" && <img
                              src={IconRemove}
                              alt="remove"
                              onClick={() => {this.handleRemove(idx, values);this.handleCalculateRate(setFieldValue, values)}}
                            />}
                          </div>
                        )}
                      </Col>
                      <Col lg="6" className="mb-2 mt-3">
                        <Label htmlFor="example-text-input-name">
                          Start Date{" "}
                        </Label>
                        <DatePickerFelid
                          name="start_date"
                          index={idx}
                          placeholder="Start Date"
                          minDate={new Date()}
                          handleCalculateRate={this.handleCalculateRate}
                          handleTimeChange={this.handleTimeChange}
                          value={field.start_date}
                          values={values}
                        />
                        <ErrorMessage className="error" name={`multiple_dates.${idx}.start_date`} component="div" />
                      </Col>
                      <Col lg="6" className="mb-2 mt-3">
                        <Label htmlFor="example-text-input-name">
                          {" "}
                          End Date{" "}
                        </Label>
                        <DatePickerFelid
                          name="end_date"
                          index={idx}
                          placeholder="End Date"
                          minDate={this.getDate(field.start_date)}
                          handleCalculateRate={this.handleCalculateRate}
                          handleTimeChange={this.handleTimeChange}
                          value={field.end_date}

                          values={values}
                        />
                        <ErrorMessage className="error" name={`multiple_dates.${idx}.end_date`} component="div" />
                      </Col>
                      <Col lg="6" className="mb-2 mt-2">
                        <Label>Start Time</Label>
                        <DatePickerFelid
                          name="start_time"
                          index={idx}
                          selected={field.start_time}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={30}
                          timeCaption="Time"
                          dateFormat="hh:mm A"
                          placeholder="Start Time"
                          rateChange
                          values={values}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          handleTimeChange={this.handleTimeChange}
                          handleCalculateRate={this.handleCalculateRate}
                          value={field.start_time}
                        />
                        <ErrorMessage className="error" name={`multiple_dates.${idx}.start_time`} component="div" />
                      </Col>
                      <Col lg="6" className="mb-2 mt-2">
                        <Label>End Time</Label>
                        <DatePickerFelid
                          name="end_time"
                          index={idx}
                          selected={field.end_time}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={30}
                          timeCaption="Time"
                          dateFormat="hh:mm A"
                          placeholder="End Time"
                          values={values}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          rateChange
                          handleCalculateRate={this.handleCalculateRate}
                          handleTimeChange={this.handleTimeChange}
                          value={field.end_time}
                        />
                        <ErrorMessage className="error" name={`multiple_dates.${idx}.end_time`} component="div" />
                      </Col>
                      <Col lg="12" className="mb-2 mt-2 ml-1 days_list">
                        {days.map((name, index) => {
                          return (
                            <div className="days_cs">
                              <input
                                type="checkbox"
                                name="days"
                                id={`custom-checkbox-${index}`}
                                value={field.days[index]}
                                checked={field.days.includes(index)}
                                onBlur={handleBlur}
                                onChange={() =>{this.handleDaysChange(index,values,idx,setFieldValue,boxId);this.handleCalculateRate(setFieldValue, values)}}
                              />
                              &nbsp;
                              <label key={index}>{name}</label>
                            </div>
                          );
                        })}
                        <ErrorMessage className="error" name={`multiple_dates.${idx}.days`} component="div" />
                      </Col>
                    </Row>
                  </div>
                );
              })}
            </Col>

          </Row>

          <div className="actions d-flex flex-row justify-content-end mt-3">
           {_.isEqual([...this.state.oldData.map((x,i) => x.box_id).sort()],values.multiple_dates.map((x) => x.box_id).sort()) ?
           <Button
              type="button"
              color="primary"
              onClick={() => this.prevStep(setErrors)}>
              Previous
            </Button> : ''}
            <Button
              type="button"
              color="success"
              className="ml-2"
              onClick={() => {this.nextStep(props,values)}}
            >
              Save
            </Button>
          </div>
        </TabPane>
      );
    }
  };

  render() {
    return (
      <React.Fragment>
        {/* Header */}
        <div className="input-group Heading-Wrapper-container">
          <div className="form-outline Heading-Wrapper">
            <img
              src={Back_arrow}
              className="back-arrow"
              onClick={this.props.onClose}
              alt="back_arrow"
            />
            <span className="details-text">
              {commonMethods.ConvertToCamelCase(this.state.data.title)}
            </span>
          </div>
        </div>
        {/* Header over */}

        <Row>
          <Col lg="12">
            <Card>
              <CardBody>
                <h2 className="card-title mb-4">
                  Fill The Below Details For {this.props.isFrom}.
                </h2>
                <div className="wizard clearfix">
                  <div className="steps d-flex flex-row justify-content-between mb-4">
                    <Button
                      color="primary"
                      className={classnames({
                        active: this.state.activeTab === 0,
                      })}
                      style={{
                        width: "100%",
                        margin: "5px",
                        marginLeft: "0px",
                      }}
                    >
                      Job Details
                    </Button>

                    <Button
                      color="primary"
                      disabled={!(this.state.passedSteps || []).includes(1)}
                      className={classnames({
                        active: this.state.activeTab === 1,
                      })}
                      style={{
                        width: "100%",
                        margin: "5px",
                      }}
                    >
                      <span>Location Details</span>
                    </Button>

                    <Button
                      color="primary"
                      disabled={!(this.state.passedSteps || []).includes(2)}
                      className={classnames({
                        active: this.state.activeTab === 2,
                      })}
                      style={{
                        width: "100%",
                        margin: "5px",
                        marginRight: "0px",
                      }}
                    >
                      Pricing Details
                    </Button>
                  </div>
                  <Formik
                    enableReinitialize
                    validateOnMount
                    initialValues={initState}
                    validationSchema={validationSchemas[this.state.activeTab]}
                    validateOnChange
                    validateOnBlur
                    onSubmit={this.handleSubmit}
                    render={(props) => (
                      <Form>
                        {this.step1(props)}
                        {this.step2({...props, ...this.state})}
                        {this.step3(props)}
                      </Form>
                    )}
                  ></Formik>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ crud, layout }) => {
  return { ...crud, ...layout };
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    Object.assign({}, crudAction, commonActions),
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(EditJobDetail));
