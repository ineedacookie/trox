import moment from "moment";
import DateRangePicker from "react-native-daterange-picker";
import React, {Component} from 'react';
import {View, TouchableOpacity, Text, TextInput} from 'react-native';
import {getOrderedKeys} from '../globals';
import DropDownPicker from 'react-native-dropdown-picker'
import PersonItem from './PersonItem';
import NewPerson from './AddPerson';
import styles from '../styles/styles';

/** Creates a list of all employees. Each employee entry can be clicked to log into their account. */
class HistoryItem extends Component {
  constructor(props) {
      super(props);
      let {item} = props;
      let persons = Object.assign({},props.persons);
      this.persons = persons;
      let {type} = props;
      this.type = type;
      this.parent_update_history_item = props.add_update_history_item
      this.state = {
          people: item.people,
          startDate: new Date(item.startDate),
          endDate: new Date(item.endDate),
          type_pk: item.type_pk,
          required_trays: item.required_trays,
          item: item,
          err_msg: '',
          hist_type: type[item.type_pk],
          toggled: false,
          displayedDate: moment(),
          opened_calendar: false,
      };
    }

   add_update_person_to_history(person, original_pk=null, remove=false){
    let people = Object.assign({},this.state.people);
    if (!remove){
        if(original_pk){
         delete people[original_pk];
        }
        people[person.pk] = person;
    } else {
        delete people[person.pk]
    }
    this.setState({
        people: people
    });
   }

   componentWillReceiveProps(props){
    let {item} = props;
      let persons = Object.assign({},props.persons);
      this.persons = persons;
      let {type} = props;
      this.type = type;
      this.parent_update_history_item = props.add_update_history_item
      this.setState({
          people: item.people,
          startDate: new Date(item.startDate),
          endDate: new Date(item.endDate),
          type_pk: item.type_pk,
          required_trays: item.required_trays,
          item: item,
          hist_type: type[item.type_pk],
          toggled: false,
          opened_calendar: false,
      });
   }

   validate(){
     let valid = true;
     let err_msg = '';

     if(isNaN(this.state.required_trays) || this.state.required_trays <= 0){
         valid = false;
         err_msg += 'Trays Required must be larger than 0\n';
     }

     this.setState({err_msg: err_msg});

     return valid;
   }

   update_history_item() {
    if(this.validate()){
        let item = Object.assign({},this.state.item);
        item.people = this.state.people;
        item.startDate = this.state.startDate;
        item.endDate = this.state.endDate;
        item.type_pk = this.state.type_pk;
        item.required_trays = this.state.required_trays;
        this.setState({item:item, toggled: false, opened_calendar: false});
        this.parent_update_history_item(item);
    }
   }

   cancel() {
    this.setState({
        people: this.state.item.people,
        startDate: this.state.item.startDate,
        endDate: this.state.item.endDate,
        type_pk: this.state.item.type_pk,
        required_trays: this.state.item.required_trays,
        err_msg: '',
        toggled: false,
        opened_calendar: false,
    });
   }

   remove(){
       this.parent_update_history_item(this.state.item, true);
     }

  return_tray_stats(){
    if(!isNaN(this.state.required_trays) || this.state.required_trays > 0){
        let total_finished_trays = 0;
        let people = this.state.people;
        for(let i in people){
            total_finished_trays += people[i].trays;
        }
        let percentage = Math.round(total_finished_trays/this.state.required_trays * 100).toString()
        return(
            <View style={styles.rowViewSpaceBetween}>
                <Text style={styles.smallerWhiteLabel}>Progress:</Text>
                <View style={styles.rowViewStats}>
                    <Text style={styles.smallerWhiteLabel}>{total_finished_trays.toString()}/{this.state.required_trays.toString()}</Text>
                    <Text style={styles.smallerRightWhiteLabel}>{percentage}%</Text>
                </View>
            </View>
        );
    } else {
        return(null);
    }
  }

  reStr(val){
        if(val || val==0){
            return(val.toString());
        } else {
            return(null);
        }
      }

    return_error_msg() {
      if(this.state.err_msg){
          return(<View style={styles.errBox}>
              <Text style={styles.errText}>{this.state.err_msg}</Text>
          </View>);
      } else {
          return(null);
      }
    }

  create_picker(){
    let type_key_list = getOrderedKeys(this.type, 'name');
    let type = this.type;
    let picker_items = [];
    for(let i in type_key_list){
        let item = type[type_key_list[i]];
        if(item.visible || item.pk == this.state.item.type_pk){
            picker_items.push({label: item.name, value:item.pk});
        }
    }
    if(picker_items.length > 0){
        return(<View style={styles.frontRowViewPadding}>
               <Text style={styles.whiteLabel}>Project Type:</Text>
               <DropDownPicker
                   dropDownStyle={styles.dropdownRelative}
                   searchable={false}
                   containerStyle={styles.dropdownContainerStyle}
                   items={picker_items}
                   style={styles.defaultPicker}
                   defaultValue={this.state.type_pk}
                   onChangeItem={(item) => {
                     this.setState({type_pk: item.value, hist_type: this.state.type[item.value]});
                   }}>
                 </DropDownPicker>
               </View>);
    } else {
        return(null);
    }
  }

  setDates = (dates) => {
      this.setState({
          ...dates
      });
  }

  create_calendar() {
      let calendar_btn_text = 'Set Date Range';
      let display_date = null;
      if(this.state.opened_calendar){
          calendar_btn_text = 'Submit Date Range';
      } else if(this.state.startDate && this.state.endDate) {
          display_date = this.state.startDate.toString().slice(4, 15) + ' to ' + this.state.endDate.toString().slice(4,15);
      }
      return(
      <View>
      <DateRangePicker
          backdropStyle={styles.backdrop}
          open={this.state.opened_calendar}
          onChange={this.setDates}
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          displayedDate={this.state.displayedDate}
          range>
          <Text style={styles.flexOneWhiteLabel}>{display_date}</Text>
      </DateRangePicker>
      <TouchableOpacity style={styles.simpleBtn} onPress={() => {this.setState({opened_calendar: !this.state.opened_calendar})}}>
          <Text style={styles.removeText} >{calendar_btn_text}</Text>
      </TouchableOpacity>
      </View>)
    }

  render() {
    /** These variables are in charge of alternating between the table colors */
    if (this.state.toggled){
        let people = Object.assign({},this.state.people);
        for(let i in people){
            people[i].name = this.persons[i].name;
        }
        let key_list = getOrderedKeys(people, 'name');
        /** Use map each employee to their own entry line for the final object */
        let people_persons = key_list.map((val, key) => {
            return(
                <PersonItem
                    person={this.state.people[val]}
                    type={this.state.hist_type}
                    update_function={this.add_update_person_to_history.bind(this)}
                    persons={this.persons}
                    used_people={this.state.people}
                    key={key}/>
            );
        });

        return (
          <View style={styles.historyTouchable}>
          <View style={styles.rowViewPadding}>
              <View style={{flex:1}}></View>
              <TouchableOpacity style={styles.removeBtn} onPress={() => this.remove()}>
                  <Text style={styles.removeText}>Delete</Text>
              </TouchableOpacity>
          </View>
            {this.create_picker()}
            <View style={styles.rowViewPadding}>
                <Text style={styles.whiteLabel}>Trays Required:</Text>
                <TextInput style={styles.flexOneInputMargin} onChangeText={(val) => {this.setState({required_trays: parseInt(val.replace(/[^0-9]/g, ''))});}}
                keyboardType='numeric'
                placeholder={'Enter top boxes given'}
                value={this.reStr(this.state.required_trays)}/>
            </View>
            {this.return_error_msg()}
            {this.create_calendar()}
            <View style={styles.rowViewPadding}></View>
            {this.return_tray_stats()}
            <View style={styles.rowViewPadding}></View>
            <View>
                <NewPerson
                    type={this.state.hist_type}
                    persons={this.persons}
                    add_function={this.add_update_person_to_history.bind(this)}
                    used_people={this.state.people}/>
                {people_persons}
            </View>
            <View style={styles.rowViewSpaceBetween}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => this.cancel()}>
                    <Text style={styles.btnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={() => this.update_history_item()}>
                    <Text style={styles.btnText}>Save Project</Text>
                </TouchableOpacity>
            </View>
          </View>
        );
    } else {
        return (
          <TouchableOpacity style={styles.historyTouchable} onPress={()=> this.setState({toggled: true})}>
            <View style={styles.rowViewSpaceBetween}>
                <Text style={styles.whiteLabel}>{this.state.hist_type.name}</Text>
                <Text style={styles.leftJustifyText}>{this.state.startDate.toString().slice(4, 15)} to {this.state.endDate.toString().slice(4, 15)}</Text>
            </View>
            {this.return_tray_stats()}
          </TouchableOpacity>
        );
    }
  }
}

export default HistoryItem;
