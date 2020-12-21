import moment from "moment";
import DropDownPicker from 'react-native-dropdown-picker';
import DateRangePicker from "react-native-daterange-picker";
import React, {Component} from 'react';
import {View, TouchableOpacity, Text, TextInput} from 'react-native';
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
      let timestamp = Date.now();
      let type_key_list = getOrderedKeys(type, 'name');
      this.parent_add_update_history_item = props.add_update_history_item;
      if(type_key_list.length > 0){
          this.state = {
              pk: timestamp,
              people: {},
              startDate: null,
              endDate: null,
              tops: 0,
              bottoms: 0,
              required_trays: 1,
              type_pk: type[type_key_list[0]].pk,
              type: type,
              hist_type: type[type_key_list[0]],
              toggled: false,
              show: true,
              persons: persons,
              err_msg: '',
              displayedDate: moment(),
              opened_calendar: false,
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
          let timestamp = Date.now();
          let type_key_list = getOrderedKeys(type, 'name');
          this.parent_add_update_history_item = props.add_update_history_item;
          if(type_key_list.length > 0){
              this.setState({
                  pk: timestamp,
                  people: {},
                  startDate: null,
                  endDate: null,
                  tops: 0,
                  bottoms: 0,
                  required_trays: 1,
                  type_pk: type[type_key_list[0]].pk,
                  type: type,
                  hist_type: type[type_key_list[0]],
                  toggled: false,
                  opened_calendar: false,
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

    setDates = (dates) => {
        this.setState({
            ...dates
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

    add_history_to_database() {
       if (this.validate()){
           let history = {
               pk: this.state.pk,
               people: this.state.people,
               startDate: this.state.startDate,
               endDate: this.state.endDate,
               tops: this.state.tops,
               bottoms: this.state.bottoms,
               type_pk: this.state.type_pk,
               required_trays: this.state.required_trays
           };
           let timestamp = Date.now()
           let type_key_list = getOrderedKeys(this.state.type, 'name');
           let type = this.state.type;
           this.setState({
                pk: timestamp,
                people: {},
                startDate: null,
                endDate: null,
                tops: 0,
                bottoms: 0,
                required_trays: 1,
                type_pk: type[type_key_list[0]].pk,
                hist_type: type[type_key_list[0]],
                toggled: false,
                opened_calendar: false
           });
           this.parent_add_update_history_item(history);
       }
    }

  cancel() {
       let timestamp = Date.now()
       let type_key_list = getOrderedKeys(this.state.type, 'name');
       let type = this.state.type;
       this.setState({
            pk: timestamp,
            people: {},
            startDate: null,
            endDate: null,
            tops: 0,
            bottoms: 0,
            required_trays: 1,
            type_pk: type[type_key_list[0]].pk,
            hist_type: type[type_key_list[0]],
            err_msg: '',
            toggled: false,
            opened_calendar: false
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
              let total_dist_tops = 0;
              let total_dist_bottoms = 0;
              let people = this.state.people;
              for(let i in people){
                  total_finished_trays += people[i].trays;
                  total_dist_tops += people[i].tops;
                  total_dist_bottoms += people[i].bottoms;
              }
              let tray_percentage = Math.round(total_finished_trays/this.state.required_trays * 100).toString();
              let tops_percentage = 0;
              let bottoms_percentage = 0;
              if(this.state.tops > 0){
                  tops_percentage = Math.round(total_dist_tops/this.state.tops * 100).toString();
              }
              if(this.state.bottoms > 0){
                  bottoms_percentage = Math.round(total_dist_bottoms/this.state.bottoms * 100).toString();
              }
              return(
                  <View>
                      <View style={styles.rowViewSpaceBetween}>
                          <Text style={styles.smallerWhiteLabel}>Tops Distributed:</Text>
                          <View style={styles.rowViewStats}>
                              <Text style={styles.smallerWhiteLabel}>{total_dist_tops.toString()}/{this.reStr(this.state.tops)}</Text>
                              <Text style={styles.smallerRightWhiteLabel}>{tops_percentage}%</Text>
                          </View>
                      </View>
                      <View style={styles.rowViewSpaceBetween}>
                          <Text style={styles.smallerWhiteLabel}>Bottoms Distributed:</Text>
                          <View style={styles.rowViewStats}>
                              <Text style={styles.smallerWhiteLabel}>{total_dist_bottoms.toString()}/{this.reStr(this.state.bottoms)}</Text>
                              <Text style={styles.smallerRightWhiteLabel}>{bottoms_percentage}%</Text>
                          </View>
                      </View>
                      <View style={styles.rowViewSpaceBetween}>
                          <Text style={styles.smallerWhiteLabel}>Progress:</Text>
                          <View style={styles.rowViewStats}>
                              <Text style={styles.smallerWhiteLabel}>{total_finished_trays.toString()}/{this.reStr(this.state.required_trays)}</Text>
                              <Text style={styles.smallerRightWhiteLabel}>{tray_percentage}%</Text>
                          </View>
                      </View>
                  </View>
              );
          } else {
              return(null);
          }
        }

  create_picker(){
    let type_key_list = getOrderedKeys(this.state.type, 'name');
    let type = this.state.type;
    let picker_items = [];
    for(let i in type_key_list){
        let item = type[type_key_list[i]];
        if(item.visible){
            picker_items.push({label: item.name, value:item.pk});
        }
    }
    if(picker_items.length > 0){
        return(
        <View style={styles.frontRowViewPadding}>
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
    if (this.state.toggled){
        /** These variables are in charge of alternating between the table colors */
        let people = Object.assign({},this.state.people);
        for(let i in people){
            people[i].name = this.state.persons[i].name;
        }
        let key_list = getOrderedKeys(people, 'name');
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

        return (
          <View style={styles.historyTouchable}>
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
            <View>
                <View style={styles.rowViewPadding}>
                    <Text style={styles.flexOneWhiteLabel}>Top Boxes</Text>
                    <Text style={styles.flexOneWhiteLabel}>Bottom Boxes</Text>
                </View>
                <View style={styles.rowViewPadding}>
                    <TextInput style={styles.flexOneInputMargin} onChangeText={(val) => {this.setState({tops: parseInt(val.replace(/[^0-9]/g, ''))});}}
                    keyboardType='numeric'
                    placeholder={'Total Top Boxes'}
                    value={this.reStr(this.state.tops)}/>
                    <TextInput style={styles.flexOneInputMargin} onChangeText={(val) => {this.setState({bottoms: parseInt(val.replace(/[^0-9]/g, ''))});}}
                    keyboardType='numeric'
                    placeholder={'Total Bottom Boxes'}
                    value={this.reStr(this.state.bottoms)}/>
                </View>
            </View>
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
