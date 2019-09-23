/* Language section */
import React from 'react';
import Cookies from 'js-cookie';
import Joi from 'joi-browser';
import { Button, Dropdown, Form, Icon, Input, Table, } from 'semantic-ui-react'

export default class Language extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showAddNewSection: false,
            newItem: {
                name: "",
                level: "",
            }
        };

        this.levelOptions = [
            { key: "1", value: "Basic", text: "Basic" },
            { key: "2", value: "Conversational", text: "Conversational" },
            { key: "3", value: "Fluent", text: "Fluent" },
            { key: "4", value: "Native/Bilingual", text: "Native/Bilingual" },
        ];

        this.schema = {
            name: Joi.string().label('Language'),
            level: Joi.string().label('Level'),
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
            const data = { languages: this.props.languageData }
            data.languages.push(this.state.newItem)
            this.props.saveProfileData(data)
            this.closeAddNew()
        }
    }

    updateItemAndSave(index, item) {
        const data = { languages: this.props.languageData }
        data.languages[index] = item;
        this.props.saveProfileData(data)
    }


    deleteItemAndSave(index) {
        const data = { languages: this.props.languageData }
        data.languages.splice(index, 1);
        this.props.saveProfileData(data)
    }

    openAddNew() {
        const newItem = {
            name: "",
            level: "",
        }

        this.setState({ showAddNewSection: true, newItem })
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
        const languages = this.props.languageData;

        return (
            <Table singleLine>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell content="Language" />
                        <Table.HeaderCell content="Level" />
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
                    {languages.map((item, index) => {
                        return <EditableTableRow
                            key={index}
                            index={index}
                            name={item.name}
                            level={item.level}
                            levelOptions={this.levelOptions}
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
        const { name, level } = this.state.newItem;

        return (
            <Form.Group>
                <Form.Input
                    name="name"
                    placeholder="Add Language"
                    value={name}
                    onChange={this.handleChange}
                />
                <Form.Dropdown
                    name="level"
                    placeholder="Select Level"
                    value={level}
                    selection
                    options={this.levelOptions}
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
            </Form.Group>
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

export class EditableTableRow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showEditSection: false,
            data: {
                name: "",
                level: "",
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
        const data = {
            name: this.props.name,
            level: this.props.level,
        }
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

    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }

    renderDisplay() {
        return (
            <Table.Row>
                <Table.Cell content={this.props.name} />
                <Table.Cell content={this.props.level} />
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
        const { name, level } = this.state.data;

        return (
            <Table.Row>
                <Table.Cell>
                    <Input
                        name="name"
                        value={name}
                        onChange={this.handleChange}
                    />
                </Table.Cell>
                <Table.Cell>
                    <Dropdown
                        name="level"
                        value={level}
                        selection
                        options={this.props.levelOptions}
                        onChange={this.handleChange}
                    />
                </Table.Cell>
                <Table.Cell >
                    <Button content="Cancel"
                        type="button"
                        basic
                        color="red"
                        floated="right"
                        onClick={this.closeEdit}
                    />
                    <Button content="Update"
                        type="button"
                        basic
                        color="blue"
                        floated="right"
                        onClick={this.saveData}
                    />
                </Table.Cell>
            </Table.Row>
        )
    }
}
