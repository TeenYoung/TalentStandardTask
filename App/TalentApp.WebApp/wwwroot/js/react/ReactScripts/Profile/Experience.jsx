/* Experience section */
import React from 'react';
import Cookies from 'js-cookie';
import Joi from 'joi-browser';
import { Button, Dropdown, Form, Icon, Input, Table, } from 'semantic-ui-react'

export default class Experience extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showAddNewSection: false,
            newItem: {
                company: "",
                position: "",
                responsibilities: "",
                start: "",
                end: "",
            }
        };

        this.schema = {
            company: Joi.string().max(150).label('Company'),
            position: Joi.string().max(100).label('Position'),
            responsibilities: Joi.string().max(300).label('Responsibilities'),
            start: Joi.date().label('Start Date'),
            end: Joi.date().label('End Date'),
        };

        this.saveNewItem = this.saveNewItem.bind(this);
        this.updateItemAndSave = this.updateItemAndSave.bind(this);
        this.deleteItemAndSave = this.deleteItemAndSave.bind(this);
        this.openAddNew = this.openAddNew.bind(this);
        this.closeAddNew = this.closeAddNew.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.validate = this.validate.bind(this);
    }

    saveNewItem() {
        const result = this.validate()
        if (result.error) {
            const errorMessage = result.error.details[0].message;
            TalentUtil.notification.show(errorMessage, "error", null, null)
        }
        else {
            const data = { experience: this.props.experienceData }
            data.experience.push(this.state.newItem)
            this.props.saveProfileData(data)
            this.closeAddNew()
        }
    }

    updateItemAndSave(index, item) {
        const data = { experience: this.props.experienceData }
        data.experience[index] = item;
        this.props.saveProfileData(data)
    }


    deleteItemAndSave(index) {
        const data = { experience: this.props.experienceData }
        data.experience.splice(index, 1);
        this.props.saveProfileData(data)
    }

    openAddNew() {
        const newItem = {
            company: "",
            position: "",
            responsibilities: "",
            start: "",
            end: "",
        }

        this.setState({ showAddNewSection: true, newItem, })
    }

    closeAddNew() {
        this.setState({ showAddNewSection: false, })
    }

    handleChange(e, d) {
        const { newItem } = this.state
        newItem[d.name] = d.value
        this.setState({ newItem })
    }

    validate() {
        const result = Joi.validate(this.state.newItem, this.schema);
        return result;
    }

    renderTable() {
        const experience = this.props.experienceData;

        return (
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell content="Company" />
                        <Table.HeaderCell content="Position" />
                        <Table.HeaderCell content="Responsibilities" />
                        <Table.HeaderCell content="Start Date" />
                        <Table.HeaderCell content="End Date" />
                        <Table.HeaderCell>
                            <Button type="button"
                                disabled={this.state.showAddNewSection}
                                floated="right"
                                color="teal"
                                onClick={this.openAddNew}
                                icon="plus"
                                content="Add New"
                            />
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {experience.map((item, index) => {
                        return <ExperienceTableRow
                            key={index}
                            index={index}
                            item={item}
                            updateItemAndSave={this.updateItemAndSave}
                            deleteItemAndSave={this.deleteItemAndSave}
                            schema={this.schema}
                        />
                    })}
                </Table.Body>
            </Table>
        )
    }

    renderAddNew() {
        const { company, position, responsibilities, start, end, } = this.state.newItem;

        return (
            <React.Fragment>
                <Form.Group widths="equal">
                    <Form.Input
                        label="Company"
                        name="company"
                        placeholder="Company"
                        value={company}
                        onChange={this.handleChange}
                    />
                    <Form.Input
                        label="Position"
                        name="position"
                        placeholder="Position"
                        value={position}
                        onChange={this.handleChange}
                    />
                </Form.Group>
                <Form.Group widths="equal">
                    <Form.Input
                        label="Start Date"
                        type="date"
                        name="start"
                        value={start}
                        onChange={this.handleChange}
                    />
                    <Form.Input
                        label="End Date"
                        type="date"
                        name="end"
                        value={end}
                        onChange={this.handleChange}
                    />
                </Form.Group>
                <Form.Input
                    label="Responsibilities"
                    name="responsibilities"
                    placeholder="Responsibilities"
                    value={responsibilities}
                    onChange={this.handleChange}
                />

                <Button content="Add"
                    type="button"
                    color="teal"
                    onClick={this.saveNewItem}
                />
                <Button content="Cancel"
                    type="button"
                    onClick={this.closeAddNew}
                />
            </React.Fragment>
        )
    }

    render() {
        return (
            <div className='ui sixteen wide column'>
                {this.state.showAddNewSection ? this.renderAddNew() : null}
                {this.renderTable()}
            </div>
        )
    }
}

class ExperienceTableRow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showEditSection: false,
            data: {
                company: "",
                position: "",
                responsibilities: "",
                start: "",
                end: "",
            }
        };

        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.validate = this.validate.bind(this)
        this.saveData = this.saveData.bind(this)
        this.deleteData = this.deleteData.bind(this)
    }

    openEdit() {
        const { company, position, responsibilities, start, end, } = this.props.item
        const startDateFormatted = this.formatDate(start, "edit");
        const endDateFormatted = this.formatDate(end, "edit");

        const data = { company, position, responsibilities, start: startDateFormatted, end: endDateFormatted, }

        this.setState({
            showEditSection: true,
            data,
        })
    }

    closeEdit() {
        this.setState({ showEditSection: false })
    }

    handleChange(e, d) {
        const { data } = this.state
        data[d.name] = d.value
        this.setState({ data })
    }

    saveData() {
        const result = this.validate()
        if (result.error) {
            const errorMessage = result.error.details[0].message;
            TalentUtil.notification.show(errorMessage, "error", null, null)
        }
        else {
            const { data } = this.state
            this.props.updateItemAndSave(this.props.index, data)
            this.closeEdit()
        }
    }

    deleteData() {
        this.props.deleteItemAndSave(this.props.index)
    }

    validate() {
        const result = Joi.validate(this.state.data, this.props.schema);
        return result;
    }

    ordinalNumber(i) {
        var j = i % 10,
            k = i % 100;
        if (j == 1 && k != 11) {
            return i + "st";
        }
        if (j == 2 && k != 12) {
            return i + "nd";
        }
        if (j == 3 && k != 13) {
            return i + "rd";
        }
        return i + "th";
    }

    formatDate(dateString, option = "view") {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        var date = new Date(dateString);
        switch (option) {
            case "view":
                return this.ordinalNumber(date.getDate()) + " "
                    + months[date.getMonth()] + ", "
                    + date.getFullYear();
            case "edit":
                return date.getFullYear() + "-"
                    + (date.getMonth() < 9 ? "0" : "")
                    + (date.getMonth() + 1) + "-"
                    + (date.getDate() <= 9 ? "0" : "")
                    + date.getDate()

            default: return dateString;
        }
    }

    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }

    renderDisplay() {
        const { company, position, responsibilities, start, end, } = this.props.item;
        const startDateFormatted = this.formatDate(start);
        const endDateFormatted = this.formatDate(end);

        return (
            <Table.Row>
                <Table.Cell content={company} />
                <Table.Cell content={position} />
                <Table.Cell content={responsibilities} />
                <Table.Cell content={startDateFormatted} />
                <Table.Cell content={endDateFormatted} />
                <Table.Cell>
                    <Icon name="delete"
                        style={{ float: "right" }}
                        size="large"
                        link
                        onClick={this.deleteData}
                    />
                    <Icon name="pencil"
                        style={{ float: "right" }}
                        size="large"
                        link
                        onClick={this.openEdit}
                    />
                </Table.Cell>
            </Table.Row>
        )
    }

    renderEdit() {
        const { company, position, responsibilities, start, end, } = this.state.data;

        return (
            <Table.Row>
                <Table.Cell colSpan="6">
                    <Form.Group widths="equal">
                        <Form.Input
                            label="Company"
                            name="company"
                            placeholder="Company"
                            value={company}
                            onChange={this.handleChange}
                        />
                        <Form.Input
                            label="Position"
                            name="position"
                            placeholder="Position"
                            value={position}
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group widths="equal">
                        <Form.Input
                            label="Start Date"
                            type="date"
                            name="start"
                            value={start}
                            onChange={this.handleChange}
                        />
                        <Form.Input
                            label="End Date"
                            type="date"
                            name="end"
                            value={end}
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Input
                        label="Responsibilities"
                        name="responsibilities"
                        placeholder="Responsibilities"
                        value={responsibilities}
                        onChange={this.handleChange}
                    />
                    <Button content="Update"
                        type="button"
                        color="teal"
                        onClick={this.saveData}
                    />
                    <Button content="Cancel"
                        type="button"
                        onClick={this.closeEdit}
                    />
                </Table.Cell>
            </Table.Row>
        )
    }
}