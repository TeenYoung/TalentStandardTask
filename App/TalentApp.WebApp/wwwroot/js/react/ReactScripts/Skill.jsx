/* Skill section */
import React from 'react';
import Cookies from 'js-cookie';
import Joi from 'joi-browser';
import { Button, Dropdown, Form, Icon, Input, Table, } from 'semantic-ui-react'
import { EditableTableRow } from './Language.jsx'

export default class Skill extends React.Component {
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
            { key: "1", value: "Beginner", text: "Beginner" },
            { key: "2", value: "Intermediate", text: "Intermediate" },
            { key: "3", value: "Expert", text: "Expert" },
        ];

        this.schema = {
            name: Joi.string().label('Skill'),
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
            const data = { skills: this.props.skillData }
            data.skills.push(this.state.newItem)
            this.props.saveProfileData(data)
            this.closeAddNew()
        }
    }

    updateItemAndSave(index, item) {
        const data = { skills: this.props.skillData }
        data.skills[index] = item;
        this.props.saveProfileData(data)
    }


    deleteItemAndSave(index) {
        const data = { skills: this.props.skillData }
        data.skills.splice(index, 1);
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
        const skills = this.props.skillData;

        return (
            <Table singleLine>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell content="Skill" />
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
                    {skills.map((item, index) => {
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
                    placeholder="Add Skill"
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

