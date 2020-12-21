import React, {Component} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {View, TouchableOpacity, Text, TextInput} from 'react-native';
import {getOrderedKeys} from '../globals';
import Checkbox from '@react-native-community/checkbox';
import styles from '../styles/styles';

/** Creates a list of all employees. Each employee entry can be clicked to log into their account. */
class PersonItem extends Component {
  constructor(props) {
      super(props);
      let {person} = props;
      let {type} = props;
      let persons = Object.assign({},props.persons);
      let {used_people} = props;
      let i;
      let upk = Object.keys(used_people);
      let prs = Object.keys(persons);
      for(i in upk){
        let j;
        if (person.pk == upk[i]){}
        else {
            for(j in prs){
                if(upk[i] == prs[j]){
                    delete persons[prs[j]];
                    prs.splice(j,1);
                    break;
                }
            }
        }
      }
      for(i in prs){
          if(!persons[prs[i]].visible && persons[prs[i]].pk != person.pk){
              delete persons[prs[i]];
              prs.splice(i,1);
          }
      }
      this.parent_update_function = props.update_function;
      let full_amount = person.trays * person.rate
      let box = person.trays/type.trays_per_box
      this.state = {
          pk: person.pk,
          box: box,
          full_amount: full_amount,
          name: persons[person.pk].name,
          paid: person.paid,
          trays: person.trays,
          tops: person.tops,
          bottoms: person.bottoms,
          shippers: person.shippers,
          rate: person.rate,
          type: type,
          person: person,
          persons: persons,
          toggled: false
      };
    }

  componentWillReceiveProps(props){
    let {person} = props;
      let {type} = props;
      let persons = Object.assign({},props.persons);
      let {used_people} = props;
      let i;
      let upk = Object.keys(used_people);
      let prs = Object.keys(persons);
      for(i in upk){
        let j;
        if (person.pk == upk[i]){}
        else {
            for(j in prs){
                if(upk[i] == prs[j]){
                    delete persons[prs[j]];
                    prs.splice(j,1);
                    break;
                }
            }
        }
      }
      for(i in prs){
                if(!persons[prs[i]].visible && persons[prs[i]].pk != person.pk){
                    delete persons[prs[i]];
                    prs.splice(i,1);
                }
            }
      this.parent_update_function = props.update_function;
      let full_amount = person.trays * person.rate
      let box = person.trays/type.trays_per_box
      this.setState({
          pk: person.pk,
          box: box,
          full_amount: full_amount,
          name: persons[person.pk].name,
          paid: person.paid,
          trays: person.trays,
          tops: person.tops,
          bottoms: person.bottoms,
          shippers: person.shippers,
          rate: person.rate,
          type: type,
          person: person,
          persons: persons,
          toggled: false
      });
  }

   update_database() {
    let person = Object.assign({},this.state.person );
    let original_pk = person.pk;
    person.pk = this.state.pk
    person.paid = this.state.paid;
    person.trays = this.state.trays;
    person.tops = this.state.tops;
    person.bottoms = this.state.bottoms;
    person.shippers = this.state.shippers;
    person.rate = this.state.rate;
    this.parent_update_function(person, original_pk);
    this.setState({person: person, toggled: false});
   }

  cancel() {
        this.reset_state();
    }

  remove(){
    this.parent_update_function(this.state.person, null, true);
  }

  reset_state() {
    let full_amount = this.state.person.trays * this.state.person.rate;
    let box = this.state.person.trays/this.state.type.trays_per_box;
   this.setState({
               pk: this.state.person.pk,
               paid: this.state.person.paid,
               trays: this.state.person.trays,
               tops: this.state.person.tops,
               bottoms: this.state.person.bottoms,
               rate: this.state.person.rate,
               full_amount: full_amount,
               box: box,
               toggled: false
           });
  }


  update_box_and_amount(rate=-1, trays=null){
    if(rate!=-1){
        let full_amount = this.state.trays * rate
        this.setState({
            full_amount: full_amount,
            rate: rate,
        });
    } else if (trays!=null) {
        let full_amount = trays * this.state.rate;
        let box = trays / this.state.type.trays_per_box;
        this.setState({
            box: box,
            full_amount: full_amount,
            trays: trays,
        });
    } else {
        let full_amount = this.state.trays * this.state.rate
        this.setState({
            box: box,
            full_amount: full_amount,
        });
    }
  }

  set_rate(val){
    let rate = val;
    try{
        let rate = parseFloat(val);
        if(rate == 0){
            rate = val;
        }
        this.update_box_and_amount(rate=rate);
    } catch {
        this.setState({rate: rate});
    }
  }

  set_trays(val){
      trays = parseInt(val.replace(/[^0-9]/g, '')),
      this.update_box_and_amount(-1, trays);
    }

  return_paid(){
    if(this.state.paid){
        return('Yes');
    } else {
        return('No');
    }
  }

  reStr(val){
    if(val){
        return(val.toString());
    } else if (val == 0){
        return('0');
    }else {
        return(null);
    }
  }

  toggle_paid(val){
    this.setState({paid: val})
  }

  create_picker(){
    let persons = this.state.persons;
    let persons_key_list = getOrderedKeys(this.state.persons, 'name');
    let picker_items = [];
    for(let i in persons_key_list){
        let item = persons[persons_key_list[i]];
        if(item.visible || item.pk == this.state.person.pk){
            picker_items.push({label: item.name, value:item.pk});
        }
    }
    if(picker_items.length > 0){
    return(
        <View style={styles.frontRowViewPadding}>
            <Text style={styles.whiteLabel}>Name:</Text>
            <DropDownPicker
                dropDownStyle={styles.dropdownRelative}
                searchable={false}
                containerStyle={styles.dropdownContainerStyle}
                items={picker_items}
                style={styles.defaultPicker}
                defaultValue={this.state.pk}
                onChangeItem={(item) => {
                  this.setState({pk: item.value, name: persons[item.value].name});
                }}>
              </DropDownPicker>
        </View>);
    } else {
        return(null);
    }
  }

  render() {
    /** These variables are in charge of alternating between the table colors */
    let full_amount = this.state.trays * this.state.rate
    if (this.state.toggled){
      return (
        <View style={styles.personTouchable}>
            <View style={styles.rowViewPadding}>
                <View style={{flex:1}}></View>
                <TouchableOpacity style={styles.removeBtn} onPress={() => this.remove()}>
                    <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
            </View>
            {this.create_picker()}
            <View style={styles.rowViewPadding}>
                <Text style={styles.whiteLabel}>Pay rate per tray:</Text>
                <TextInput style={styles.defaultPicker} onChangeText={(val) => {this.set_rate(val)}}
                keyboardType='numeric'
                placeholder={'Enter Rate Per Tray'}
                value={this.reStr(this.state.rate)}/>
            </View>
            <View>
                <View style={styles.rowViewPadding}>
                    <Text style={styles.flexOneWhiteLabel}>Boxes</Text>
                    <Text style={styles.flexOneWhiteLabel}>Trays</Text>
                    <Text style={styles.flexOneWhiteLabel}>Cost</Text>
                </View>
                <View style={styles.rowViewPadding}>
                    <Text style={styles.flexOneValue}>{this.reStr(this.state.box)}</Text>
                    <TextInput style={styles.flexOneInput} onChangeText={(val) => {this.set_trays(val)}}
                    keyboardType='numeric'
                    placeholder={'Enter Trays Done'}
                    value={this.reStr(this.state.trays)}/>
                    <Text style={styles.flexOneValue}>${this.state.full_amount}</Text>
                </View>
            </View>
            <View>
                <View style={styles.rowViewPadding}>
                    <Text style={styles.flexOneWhiteLabel}>Top Boxes</Text>
                    <Text style={styles.flexOneWhiteLabel}>Bottom Boxes</Text>
                </View>
                <View style={styles.rowViewPadding}>
                    <TextInput style={styles.flexOneInputMargin} onChangeText={(val) => {this.setState({tops: parseInt(val.replace(/[^0-9]/g, ''))});}}
                    keyboardType='numeric'
                    placeholder={'Enter top boxes given'}
                    value={this.reStr(this.state.tops)}/>
                    <TextInput style={styles.flexOneInputMargin} onChangeText={(val) => {this.setState({bottoms: parseInt(val.replace(/[^0-9]/g, ''))});}}
                    keyboardType='numeric'
                    placeholder={'Enter bottom boxes given'}
                    value={this.reStr(this.state.bottoms)}/>
                </View>
            </View>
            <View style={styles.rowViewPadding}>
                <Text style={styles.whiteLabel}>Paid: </Text>
                <Checkbox onValueChange={(val) => {this.toggle_paid(val)}}
                value={this.state.paid}/>
            </View>
            <View style={styles.rowViewSpaceBetween}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => this.cancel()}>
                    <Text style={styles.btnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={() => this.update_database()}>
                    <Text style={styles.btnText}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
      );
    }
    else{
        return (
                <TouchableOpacity style={styles.rowPersonTouchable} onPress={() => this.setState({toggled: true})}>
                    <Text style={styles.smallerWhiteLabel}>{this.state.name}</Text>
                    <Text style={styles.smallerWhiteLabel}>Trays: {this.state.trays}</Text>
                    <Text style={styles.smallerWhiteLabel}>Cost: ${full_amount}</Text>
                    <Text style={styles.smallerWhiteLabel}>Paid: {this.return_paid()}</Text>
                </TouchableOpacity>
              );
    }
  }
}

export default PersonItem;
