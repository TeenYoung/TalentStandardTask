import React from 'react'
import { SingleInput } from '../Form/SingleInput.jsx';
import { Form } from 'semantic-ui-react'

export default class VisaStatus extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            propsCopied: false,
            data: {
                visaExpiryDate: "",
            }
        }

        this.visaOptions = [
            { key: "citizen", value: "citizen", text: "Citizen" },
            { key: "pr", value: "pr", text: "Permanent Resident" },
            { key: "work", value: "work", text: "Work Visa" },
            { key: "student", value: "student", text: "Student Visa" },
        ];

        this.handleChange = this.handleChange.bind(this);
        this.saveChange = this.saveChange.bind(this);
        this.saveData = this.saveData.bind(this)
    }

    componentDidUpdate() {
        if (!this.state.propsCopied) {
            this.setState({
                propsCopied: true,
                data: {
                    visaExpiryDate: this.formatDate(this.props.visaExpiryDate),
                }
            })
        }
    }

    handleChange(e, d) {
        const data = { [d.name]: d.value }
        this.setState({ data })
    }

    saveChange(e, d) {
        const data = { [d.name]: d.value }
        this.props.saveProfileData(data)
    }

    saveData() {
        const { data } = this.state
        this.props.saveProfileData(data)
    }

    formatDate(dateString) {
        var date = new Date(dateString);
        return date.getFullYear() + "-"
            + (date.getMonth() < 9 ? "0" : "")
            + (date.getMonth() + 1) + "-"
            + (date.getDate() <= 9 ? "0" : "")
            + date.getDate()
    }

    render() {
        const { visaStatus } = this.props;
        const isDataChanged = this.state.data.visaExpiryDate !== this.formatDate(this.props.visaExpiryDate);

        return (
            <div className="ui sixteen wide column">
                <Form.Group>
                    < Form.Dropdown
                        width="6"
                        label="Visa Type"
                        name='visaStatus'
                        placeholder='Select Visa Type'
                        selection
                        options={this.visaOptions}
                        value={visaStatus}
                        onChange={this.saveChange}
                    />
                    {(visaStatus === "work" || visaStatus === "student") ?
                        <React.Fragment>
                            <Form.Input
                                width="6"
                                label="Visa Expiry Date"
                                name='visaExpiryDate'
                                type="date"
                                value={this.state.data.visaExpiryDate}
                                onChange={this.handleChange}
                            />
                            <Form.Button
                                label="Action"
                                content="Save"
                                type="button"
                                disabled={!isDataChanged}
                                color="teal"
                                onClick={this.saveData}
                            />
                        </React.Fragment>
                        : null}
                </Form.Group>
            </div>
        )
    }
}