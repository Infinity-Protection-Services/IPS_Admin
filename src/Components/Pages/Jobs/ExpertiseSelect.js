import React, { Component } from 'react';
import Select from 'react-select';
import { ErrorMessage } from 'formik'
class ExpertiseSelect extends Component {

  handleChange = (value) => {
    this.props.onChange(this.props.name, value || [])
  }
  handleBlur = () => {
    this.props.onBlur(this.props.name, true)
  }
  render() {
    return (
      <div>
        <Select
          isMulti={true}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          value={this.props.value}
          options={this.props.options}
          placeholder="Please select expertise or skill set"
        />
        {!!this.props.error &&
          this.props.touched && (
            <ErrorMessage className="error" name={this.props.name} component='div' />)}
      </div>
    )
  }
}
export default ExpertiseSelect
