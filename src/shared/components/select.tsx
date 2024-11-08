import React from 'react';
import { FieldProps } from 'formik';
import Select from 'react-select';

const SelectField: React.FC<FieldProps & { options: any }> = ({ field, form, options, ...props }) => {
    return (
        <Select
            {...field}
            {...props}
            options={options}
            onChange={(option) => {
                form.setFieldValue(field.name, option);
            }}
            onBlur={() => form.setFieldTouched(field.name)}
        />
    );
};

export default SelectField;
