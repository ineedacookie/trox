import {Picker} from '@react-native-community/picker'
import React, {Component} from 'react';
import {View, TouchableOpacity, Text, TextInput} from 'react-native';
import DatePicker from 'react-native-datepicker'
import {build_display_date, getOrderedKeys} from '../globals';
import PersonItem from './PersonItem';
import NewPerson from './AddPerson';
import styles from '../styles/styles';

/** Creates a list of all employees. Each employee entry can be clicked to log into their account. */
class AddHistory extends Component {
  constructor(props) {
      super(props);
      let {type} = props;
      let {persons} = props;
      let today = build_display_date(new Date());
      let timestamp = Date.now();
      let type_key_list = getOrderedKeys(type, 'name');
      this.parent_add_update_history_item = props.add_update_history_item;
      if(type_key_list.length > 0){
          this.state = {
              pk: timestamp,
              people: {},
              start_date: today,
              end_date: today,
              required_trays: 0,
              type_pk: type[type_key_list[0]].pk,
              type: type,
              hist_type: type[type_key_list[0]],
              toggled: false,
              show: true,
              persons: persons,
              err_msg: '',
          };
      } else {
        this.state = {
            toggled: false,
            show: false,
        }
      }
    }

    componentWillReceiveProps(props){
        let {type} = props;
          let {persons} = props;
          let today = build_display_date(new Date());
          let timestamp = Date.now();
          let type_key_list = getOrderedKeys(type, 'name');
          this.parent_add_update_history_item = props.add_update_history_item;
          if(type_key_list.length > 0){
              this.setState({
                  pk: timestamp,
                  people: {},
                  start_date: today,
                  end_date: today,
                  required_trays: 0,
                  type_pk: type[type_key_list[0]].pk,
                  type: type,
                  hist_type: type[type_key_list[0]],
                  toggled: false,
                  show: true,
                  err_msg: '',
                  persons: persons
              });
          } else {
            this.setState({
                toggled: false,
                show: false,
            });
          }

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

    add_history_to_database() {
       if (this.validate()){
           let history = {
               pk: this.state.pk,
               people: this.state.people,
               start_date: this.state.start_date,
               end_date: this.state.end_date,
               type_pk: this.state.type_pk,
               required_trays: this.state.required_trays
           };
           let today = build_display_date(new Date())
           let timestamp = Date.now()
           let type_key_list = getOrderedKeys(this.state.type, 'name');
           let type = this.state.type;
           this.setState({
                pk: timestamp,
                people: {},
                start_date: today,
                end_date: today,
                required_trays: 0,
                type_pk: type[type_key_list[0]].pk,
                hist_type: type[type_key_list[0]],
                toggled: false
           });
           this.parent_add_update_history_item(history);
       }
    }

  cancel() {
    let today = build_display_date(new Date())
       let timestamp = Date.now()
       let type_key_list = getOrderedKeys(this.state.type, 'name');
       let type = this.state.type;
       this.setState({
            pk: timestamp,
            people: {},
            start_date: today,
            end_date: today,
            required_trays: 0,
            type_pk: type[type_key_list[0]].pk,
            hist_type: type[type_key_list[0]],
            err_msg: '',
            toggled: false
       });
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

  render() {
    if (this.state.toggled){
        /** These variables are in charge of alternating between the table colors */
        let people = Object.assign({},this.state.people);
        for(let i in people){
            people[i].name = this.state.persons[i].name;
        }
        let key_list = getOrderedKeys(people, 'name');
        /** Use map each employee to their own entry line for the final object */
        let people_persons = key_list.map((val, key) => {
            return(
                <PersonItem
                    person={people[val]}
                    type={this.state.hist_type}
                    update_function={this.add_update_person_to_history.bind(this)}
                    persons={this.state.persons}
                    used_people={this.state.people}
                    key={key}/>
            );
        });
        let type_key_list = getOrderedKeys(this.state.type, 'name');
        let type = this.state.type;
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
                  this.setState({type_pk: itemValue, hist_type: this.state.type[itemValue]});
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
                    persons={this.state.persons}
                    add_function={this.add_update_person_to_history.bind(this)}
                    used_people={this.state.people}/>
                {people_persons}
            </View>
            <View style={styles.rowViewSpaceBetween}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => this.cancel()}>
                    <Text style={styles.btnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={() => this.add_history_to_database()}>
                    <Text style={styles.btnText}>Save Project</Text>
                </TouchableOpacity>
            </View>
          </View>
        );
    } else {
        if (this.state.show){
            return (
              <TouchableOpacity style={styles.rowHistoryTouchable} onPress={()=> this.setState({toggled: true})}>
                <Text style={styles.whiteLabel}>Add new project log</Text>
              </TouchableOpacity>
            );
        } else {
            return(null);
        }
    }
  }
}

export default AddHistory;
