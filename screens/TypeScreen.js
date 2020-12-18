import React from 'react';
import {Picker} from '@react-native-community/picker';
import {View, TouchableOpacity, Text, TextInput, ActivityIndicator, ScrollView} from 'react-native';
import {getItemFromStorage, setItemInStorage, getOrderedKeys} from '../globals';
import styles from '../styles/styles';
import Checkbox from '@react-native-community/checkbox';

export default class TypeScreen extends React.Component {
  /** No properties are required for this home screen */
  constructor(props) {
    super(props);
    this.state = {
        type: {},
        type_pk: -1,
        name: null,
        normal_rate: '0',
        trays_per_box: '1',
        loading: true,
        err_msg: '',
        visible: true,
    };
  }

  /** when this screen mounts execute this code. */
  async componentDidMount() {
    this.setState({loading: true});
    let type = await getItemFromStorage('type');
    this.setState({type:type, loading: false});
  }

  pickerChanged(type_pk){
    if(type_pk == -1){
        this.setState({
            type_pk: -1,
            name: null,
            normal_rate: '0',
            trays_per_box: '1',
            visible: true,
        });
    } else {
        let selected_type = this.state.type[type_pk];
        this.setState({
            type_pk: type_pk,
            name: selected_type.name,
            normal_rate: selected_type.normal_rate.toString(),
            trays_per_box: selected_type.trays_per_box.toString(),
            visible: selected_type.visible,
        });
    }
  }

  create_picker() {
    let type_key_list = getOrderedKeys(this.state.type, 'name');
    let type = this.state.type;
    return(
        <View style={styles.rowViewPadding}>
        <Picker
          style={styles.defaultPicker}
          key={'picker'}
          testID={'picker'}
          selectedValue={this.state.type_pk}
          onValueChange={(itemValue, itemIndex) => {
            this.pickerChanged(itemValue);
          }}>
          {this.create_default_picker_item()}
          {type_key_list.map((v) => {
            return (
              <Picker.Item label={type[v].name} value={type[v].pk} key={type[v].pk} />
            );
          })}
        </Picker>
        </View>
    )
  }

  create_default_picker_item() {
    return (<Picker.Item label='Create New Type' value='-1' key='new'/>)
  }

  // TODO CREATE delete function logic
  // TODO CREATE SOME SORT OF confirmation for the user

  validate(){
    let valid = true;
    let err_msg = '';

    if(!this.state.name){
        valid = false;
        err_msg += 'Name cannot be empty\n';
    }

    try{
        let rate = parseFloat(this.state.normal_rate);
        if(rate <= 0 || isNaN(rate)){
            err_msg += 'Tray rate must be larger than 0\n';
            valid = false;
        }
    } catch (err) {
        err_msg += 'Tray rate must be a valid decimal number\n';
        valid = false;
    }

    try{
        let tpb = parseInt(this.state.trays_per_box);
        if(tpb <= 0 || isNaN(tpb)){
            err_msg += 'The number of trays per box must be larger than 0\n';
            valid = false;
        }
    } catch (err) {
        err_msg += 'The number of trays per box must be a number\n';
        valid = false;
    }

    this.setState({err_msg: err_msg});

    return valid;
  }

  saveClicked(){
    let valid = this.validate();
    if(valid){
        let type_pk = this.state.type_pk
        if(type_pk == -1){
            // create a new type
            let type = {...this.state.type}
            let max_pk = 0
            let i;
            for(i in type){
                if(type[i].pk > max_pk){
                    max_pk = type[i].pk;
                }
            }
            max_pk = max_pk + 1;
            type[max_pk] = {
                pk: max_pk,
                name: this.state.name,
                normal_rate: parseFloat(this.state.normal_rate),
                trays_per_box: parseInt(this.state.trays_per_box),
                visible: this.state.visible,
            }

            setItemInStorage('type', type);
            this.setState({
                type: type,
                type_pk: max_pk
            });
        } else {
            // update type
            let type = {...this.state.type}
            type[type_pk].name = this.state.name;
            type[type_pk].normal_rate = this.state.normal_rate.toString();
            type[type_pk].trays_per_box = this.state.trays_per_box.toString();
            type[type_pk].visible = this.state.visible;

            setItemInStorage('type', type);
            this.setState({
                type: type
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
                    placeholder={'Enter type name'}
                    value={this.state.name}/>
                  </View>
                  <View style={styles.rowViewPadding}>
                    <Text style={styles.flexOneWhiteLabel}>Normal Rate Per Tray</Text>
                    <Text style={styles.flexOneWhiteLabel}>Trays Per Box</Text>
                  </View>
                 <View style={styles.rowViewPadding}>
                     <TextInput style={styles.flexOneInputMargin} onChangeText={(val) => {this.setState({normal_rate: val});}}
                     keyboardType='numeric'
                     placeholder={'Enter normal rate per tray'}
                     value={this.state.normal_rate}/>
                     <TextInput style={styles.flexOneInputMargin} onChangeText={(val) => {this.setState({trays_per_box:val});}}
                     keyboardType='numeric'
                     placeholder={'Number of trays per box'}
                     value={this.state.trays_per_box}/>
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