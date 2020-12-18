import React, {Component} from 'react';
import {View, TouchableOpacity, Text, TextInput} from 'react-native';
import {getOrderedKeys} from '../globals';
import {Picker} from '@react-native-community/picker';
import DatePicker from 'react-native-datepicker'
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
          start_date: item.start_date,
          end_date: item.end_date,
          type_pk: item.type_pk,
          required_trays: item.required_trays,
          item: item,
          err_msg: '',
          hist_type: type[item.type_pk],
          toggled: false
      };
    }

   add_update_person_to_history(person){
    let people = Object.assign({},this.state.people);
    people[person.pk] = person;
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
          start_date: item.start_date,
          end_date: item.end_date,
          type_pk: item.type_pk,
          required_trays: item.required_trays,
          item: item,
          hist_type: type[item.type_pk],
          toggled: false
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
        item.start_date = this.state.start_date;
        item.end_date = this.state.end_date;
        item.type_pk = this.state.type_pk;
        item.required_trays = this.state.required_trays;
        this.setState({item:item, toggled: false});
        this.parent_update_history_item(item);
    }
   }

   cancel() {
    this.setState({
        people: this.state.item.people,
        start_date: this.state.item.start_date,
        end_date: this.state.item.end_date,
        type_pk: this.state.item.type_pk,
        required_trays: this.state.item.required_trays,
        err_msg: '',
        toggled: false
    });
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


  render() {
    /** These variables are in charge of alternating between the table colors */
    if (this.state.toggled){
        let people = Object.assign({},this.state.people);
        let key_list = getOrderedKeys(people, 'name');
        /** Use map each employee to their own entry line for the final object */
        let people_persons = key_list.map((val, key) => {
            return(
                <PersonItem
                    person={people[val]}
                    type={this.state.hist_type}
                    update_function={this.add_update_person_to_history.bind(this)}
                    persons={this.persons}
                    used_people={this.state.people}
                    key={key}/>
            );
        });
        let type_key_list = getOrderedKeys(this.type, 'name');
        let type = this.type;
        return (
          <View style={styles.historyTouchable}>
          <View style={styles.rowViewPadding}>
            <Text style={styles.whiteLabel}>Project Type:</Text>
            <Picker
                style={styles.defaultPicker}
                key={'picker'}
                testID={'picker'}
                selectedValue={
                  this.state.type_pk > -1
                    ? this.state.type_pk
                    : undefined
                }
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({type_pk: itemValue, hist_type: this.type[itemValue]});
                }}>
                {type_key_list.map((v) => {
                    if(type[v].visible){
                      return (
                        <Picker.Item label={type[v].name} value={type[v].pk} key={type[v].pk} />
                      );
                    } else {
                        return (null);
                    }
                })}
              </Picker>
            </View>
            <View style={styles.rowViewPadding}>
                <Text style={styles.whiteLabel}>Trays Required:</Text>
                <TextInput style={styles.flexOneInputMargin} onChangeText={(val) => {this.setState({required_trays: parseInt(val.replace(/[^0-9]/g, ''))});}}
                keyboardType='numeric'
                placeholder={'Enter top boxes given'}
                value={this.reStr(this.state.required_trays)}/>
            </View>
            {this.return_error_msg()}
            <View style={styles.centerView}>
                <View style={styles.datePickerView}>
                    <DatePicker
                        style={styles.datePicker}
                        date={this.state.start_date}
                        mode="date"
                        placeholders="start date"
                        format="MM-DD-YYYY"
                        onDateChange={(date) => {this.setState({start_date: date})}}/>
                    <Text style={styles.whiteTo}>To</Text>
                    <DatePicker
                        style={styles.datePicker}
                        date={this.state.end_date}
                        mode="date"
                        placeholders="start date"
                        format="MM-DD-YYYY"
                        onDateChange={(date) => {this.setState({end_date: date})}}/>
                </View>
            </View>
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
                <TouchableOpacity style={styles.saveBtn} onPress={() => this.update_history_item()}>
                    <Text style={styles.btnText}>Save Project</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => this.cancel()}>
                    <Text style={styles.btnText}>Cancel</Text>
                </TouchableOpacity>
            </View>
          </View>
        );
    } else {
        return (
          <TouchableOpacity style={styles.historyTouchable} onPress={()=> this.setState({toggled: true})}>
            <View style={styles.rowViewSpaceBetween}>
                <Text style={styles.whiteLabel}>{this.state.hist_type.name}</Text>
                <Text style={styles.leftJustifyText}>{this.state.start_date} - {this.state.end_date}</Text>
            </View>
            {this.return_tray_stats()}
          </TouchableOpacity>
        );
    }
  }
}

export default HistoryItem;
