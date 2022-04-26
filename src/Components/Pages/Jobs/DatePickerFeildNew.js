import React from "react";
import { Field } from "formik";
import moment from "moment";
import { withRouter } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerFeildNew = (props) => {
  return (
    <Field name={props.name}>
      {({ field, form: { setFieldValue, values } }) => {
        return (
          <DatePicker
            className="form-control"
            {...field}
            value={props.value}
            placeholderText={props.placeholder || ""}
            minDate={props.minDate}
            dateFormat={props.dateFormat || "yyyy-MM-dd"}
            showTimeSelect={props.showTimeSelect || false}
            showTimeSelectOnly={props.showTimeSelectOnly || false}
            timeIntervals={props.timeIntervals || null}
            timeCaption={props.timeCaption || null}
            selected={field.value || null}
            onChange={(val) => {
              props.handleTimeChange(
                setFieldValue,
                field.name,
                val,
                values,
                props.index
              );
              props.handleCalculateRate(setFieldValue, {
                ...props.values,
                [field.name]: val,
              });
            }}
            disabled={true}
          />
        );
      }}
    </Field>
  );
};

export default withRouter(DatePickerFeildNew);
