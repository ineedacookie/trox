import React, {Component} from 'react';
import {View, TouchableOpacity, Text, TextInput} from 'react-native';
import {getOrderedKeys} from '../globals';
import DropDownPicker from 'react-native-dropdown-picker';
import Checkbox from '@react-native-community/checkbox';
import styles from '../styles/styles';

/** Creates a list of all employees. Each employee entry can be clicked to log into their account. */
class NewPerson extends Component {
  constructor(props) {
      super(props);
      let {type} = props;
      let persons = Object.assign({},props.persons);
      let {used_people} = props;
      let i;
      let upk = Object.keys(used_people);
        let prs = Object.keys(persons);
        for(i in upk){
          let j;
          for(j in prs){
              if(upk[i] == prs[j]){
                  delete persons[prs[j]];
                  prs.splice(j,1);
                  break;
              }
          }
        }
        for(i in prs){
            if(!persons[prs[i]].visible){
                delete persons[prs[i]];
            }
        }
      let persons_key_list = getOrderedKeys(persons, 'name');
      if(persons_key_list.length > 0){
          this.parent_add_function = props.add_function;
          this.state = {
              pk: persons[persons_key_list[0]].pk,
              box: 0,
              full_amount: 0,
              paid: false,
              trays: 0,
              tops: 0,
              bottoms: 0,
              shippers: 0,
              rate: type.normal_rate,
              type: type,
              persons: persons,
              toggled: false,
              show: true
          };
      } else {
        this.state = {
            toggled: false,
            show: false
        }
      }
    }

    componentWillReceiveProps(props){
        let {type} = props;
          let persons = Object.assign({},props.persons);
          let {used_people} = props;
          let i;
          let upk = Object.keys(used_people);
            let prs = Object.keys(persons);
            for(i in upk){
              let j;
              for(j in prs){
                  if(upk[i] == prs[j]){
                      delete persons[prs[j]];
                      prs.splice(j,1);
                      break;
                  }
              }
            }
          for(i in prs){
              if(!persons[prs[i]].visible){
                  delete persons[prs[i]];
              }
          }
          let persons_key_list = getOrderedKeys(persons, 'name');
          if(persons_key_list.length > 0){
              this.parent_add_function = props.add_function;
              this.setState({
                  pk: persons[persons_key_list[0]].pk,
                  box: 0,
                  full_amount: 0,
                  paid: false,
                  trays: 0,
                  tops: 0,
                  bottoms: 0,
                  shippers: 0,
                  rate: type.normal_rate,
                  type: type,
                  persons: persons,
                  toggled: false,
                  show: true
              });
          } else {
            this.setState({
                toggled: false,
                show: false
            });
          }
    }

   add_to_history_database() {
    let person = {
        pk: this.state.pk,
        paid: this.state.paid,
        trays: this.state.trays,
        tops: this.state.tops,
        bottoms: this.state.bottoms,
        shippers: this.state.shippers,
        rate: this.state.rate
    };
    let persons = Object.assign({}, this.state.persons);
    delete persons[person.pk];
    if(persons.length > 0){
        let persons_key_list = getOrderedKeys(persons, 'name');
        this.setState({
                    pk: persons[persons_key_list[0]].pk,
                    paid: false,
                    trays: 0,
                    tops: 0,
                    bottoms: 0,
                    rate: this.state.type.normal_rate,
                    full_amount: 0,
                    box: 0,
                    persons: persons,
                    toggled: false
                });
    } else {
        this.setState({
            toggled: false,
            show: false
        });
    }
    this.parent_add_function(person);
   }

  cancel() {
    let persons_key_list = getOrderedKeys(this.state.persons, 'name');
    this.setState({
                pk: this.state.persons[persons_key_list[0]].pk,
                paid: false,
                trays: 0,
                tops: 0,
                bottoms: 0,
                rate: this.state.type.normal_rate,
                full_amount: 0,
                box: 0,
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

  reStr(val){
    if(val){
        return(val.toString());
    } else if (val == 0){
        return('0');
    }else {
        return(null);
    }
  }

  create_picker(){
    let persons_key_list = getOrderedKeys(this.state.persons, 'name');
      let persons = this.state.persons;
      let picker_items = [];
      for(let i in persons_key_list){
          let item = persons[persons_key_list[i]];
          if(item.visible){
              picker_items.push({label: item.name, value:item.pk});
          }
      }
      if(picker_items.length > 0){
        return(<View style={styles.rowViewPadding}>
               <Text style={styles.whiteLabel}>Name:</Text>
               <DropDownPicker
                   searchable={false}
                   containerStyle={styles.dropdownContainerStyle}
                   items={picker_items}
                   style={styles.defaultPicker}
                   defaultValue={this.state.pk}
                   onChangeItem={(item) => {
                     this.setState({pk: item.value});
                   }}>
                 </DropDownPicker>
               </View>);
      } else {
        return(null);
      }
  }

  render() {
    /** These variables are in charge of alternating between the table colors */
    if (this.state.toggled){
      let full_amount = this.state.trays * this.state.rate

      return (
        <View style={styles.personTouchable}>
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
                <Checkbox onValueChange={(val) => {this.setState({paid: val})}}
                value={this.state.paid}/>
            </View>
            <View style={styles.rowViewSpaceBetween}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => this.cancel()}>
                    <Text style={styles.btnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={() => this.add_to_history_database()}>
                    <Text style={styles.btnText}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
      );
    }
    else{
        if(this.state.show){
            return (
                    <TouchableOpacity style={styles.rowPersonTouchable} onPress={() => this.setState({toggled: true})}>
                        <Text style={styles.whiteLabel} >Add new person</Text>
                    </TouchableOpacity>
                  );
        } else {
            return(null);
        }
    }
  }
}

export default NewPerson;
