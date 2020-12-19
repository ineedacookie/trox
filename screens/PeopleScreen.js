import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {View, TouchableOpacity, Text, TextInput, ActivityIndicator, ScrollView} from 'react-native';
import {getItemFromStorage, setItemInStorage, getOrderedKeys} from '../globals';
import styles from '../styles/styles';
import Checkbox from '@react-native-community/checkbox';

export default class PeopleScreen extends React.Component {
  /** No properties are required for this home screen */
  constructor(props) {
    super(props);
    this.state = {
        persons: {},
        person_pk: -1,
        name: null,
        loading: true,
        visible: true,
        err_msg: ''
    };
  }

  /** when this screen mounts execute this code. */
  async componentDidMount() {
    this.setState({loading: true});
    let persons = await getItemFromStorage('persons');
    this.setState({persons:persons, loading: false});
  }

  pickerChanged(person_pk){
    if(person_pk == -1){
        this.setState({
            person_pk: -1,
            name: null,
            visible: true,
        });
    } else {
        let selected_person = this.state.persons[person_pk];
        this.setState({
            person_pk: person_pk,
            name: selected_person.name,
            visible: selected_person.visible
        });
    }
  }

  create_picker() {
    let person_key_list = getOrderedKeys(this.state.persons, 'name');
    let persons = this.state.persons;
    console.log(persons);
    let picker_items = [{label: 'Create New Person', value:-1}];
    for(let i in person_key_list){
        let item = persons[person_key_list[i]];
        picker_items.push({label: item.name, value:item.pk});
    }
    console.log(picker_items);
    return(
        <View style={styles.rowViewPadding}>
        <DropDownPicker
            containerStyle={styles.dropdownContainerStyle}
            items={picker_items}
            style={styles.defaultPicker}
            defaultValue={this.state.person_pk}
            onChangeItem={(item) => {this.pickerChanged(item.value)}}>
          </DropDownPicker>
        </View>
    )
  }

  validate(){
      let valid = true;
      let err_msg = '';

      if(!this.state.name){
          valid = false;
          err_msg += 'Name cannot be empty\n';
      }

      this.setState({err_msg: err_msg});

      return valid;
    }

  saveClicked(){
    let valid = this.validate();
    if(valid){
        let person_pk = this.state.person_pk
        if(person_pk == -1){
            // create a new type
            let persons = {...this.state.persons}
            let max_pk = 0
            let i;
            for(i in persons){
                if(persons[i].pk > max_pk){
                    max_pk = persons[i].pk;
                }
            }
            max_pk = max_pk + 1;
            persons[max_pk] = {
                pk: max_pk,
                name: this.state.name,
                visible: this.state.visible
            }

            setItemInStorage('persons', persons);
            this.setState({
                persons: persons,
                person_pk: max_pk
            });
        } else {
            // update type
            let persons = Object.assign({},this.state.persons);
            persons[person_pk].name = this.state.name;
            persons[person_pk].visible = this.state.visible;

            setItemInStorage('persons', persons);
            this.setState({
                persons: persons
            });
        }
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
    if (this.state.loading) {
      return (
          <View style={styles.loadView}>
            <ActivityIndicator size="large" color="#e7ebee" />
          </View>
        );
    } else {
        return (
            <View style={styles.pageView}>
                    {this.create_picker()}
                    {this.return_error_msg()}
                  <View style={styles.rowViewPadding}>
                    <Text style={styles.whiteLabel}>Name:</Text>
                    <TextInput style={styles.defaultPicker} onChangeText={(val) => {this.setState({name: val});}}
                    placeholder={'Enter the persons name'}
                    value={this.state.name}/>
                  </View>
                  <View style={styles.rowViewPadding}>
                         <Text style={styles.whiteLabel}>Visible in selector: </Text>
                         <Checkbox onValueChange={(val) => {this.setState({visible:val});}}
                         value={this.state.visible}/>
                     </View>
                <View style={styles.bottomBtn}>
                    <TouchableOpacity style={styles.saveBtnNoFlex} onPress={() => this.saveClicked()}>
                        <Text style={styles.btnText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
          );
    }
  }
}