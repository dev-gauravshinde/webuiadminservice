import React from 'react';
import Select from 'react-select';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface OptionType {
    value: string;
    label: string;
}

const RoleMaster: React.FC = () => {
    const options: OptionType[] = [
        { value: 'orange', label: 'Orange' },
        { value: 'white', label: 'White' },
        { value: 'purple', label: 'Purple' },
    ];

    const validationSchema = Yup.object().shape({
        role: Yup.object()
            .nullable()
            .required('Role is required'),
    });

    return (
        <Formik
            initialValues={{ role: null }}  // Start with no selection
            validationSchema={validationSchema}
            onSubmit={(values) => {
                console.log('Selected role:', values.role);
            }}
        >
            {({ setFieldValue, errors, touched }) => (
                <Form>
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 custom-select">
                        <div className="mb-5">
                            <Field name="role">
                                {({ field }: { field: any }) => (
                                    <Select
                                        {...field}
                                        options={options}
                                        onChange={(option: OptionType | null) => setFieldValue('role', option)}
                                        onBlur={() => setFieldValue('role', field.value)}
                                        isSearchable={false}
                                        // No defaultValue set
                                    />
                                )}
                            </Field>
                            <ErrorMessage name="role">
                                {(msg) => <div className="text-red-500">{msg}</div>}
                            </ErrorMessage>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </Form>
            )}
        </Formik>
    );
};

export default RoleMaster;
