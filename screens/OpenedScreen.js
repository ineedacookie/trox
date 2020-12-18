import React from 'react';
import {getItemFromStorage, setItemInStorage, getOrderedKeys} from '../globals';
import HistoryItem from '../components/HistoryItem'
import AddHistory from '../components/AddHistory'
import styles from '../styles/styles';

import {
    ActivityIndicator,
    View,
    ScrollView
} from 'react-native'

export default class OpenedScreen extends React.Component {
  /** No properties are required for this home screen */
  constructor(props) {
    super(props);
    this.state = {
        opened: {},
        type: {},
        persons: {},
        loading: true
    };
  }

  /** when this screen mounts execute this code. */
  async componentDidMount() {
    this.props.navigation.addListener('focus', this.onScreenFocus.bind(this));
  }

  async onScreenFocus() {
    this.setState({loading: true});
    let opened = await getItemFromStorage('opened');
    let type = await getItemFromStorage('type');
    let persons = await getItemFromStorage('persons');
    this.setState({opened: opened, type:type, persons:persons, loading: false});
  }



  add_update_history_item(history, remove=false){
      opened = Object.assign({},this.state.opened);
      if (!remove){
          opened[history.pk] = history;
      } else {
        delete opened[history.pk];
      }
      setItemInStorage('opened', opened);
      this.setState({
          opened: opened
      });
     }

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.loadView}>
          <ActivityIndicator size="large" color="#e7ebee" />
        </View>
      );
    } else {
        let key_list = getOrderedKeys(this.state.opened, 'pk');
        let opened = this.state.opened
        let history = key_list.map((key) => {
            return(
                <HistoryItem
                    item={opened[key]}
                    key={opened[key].pk}
                    type={this.state.type}
                    add_update_history_item={this.add_update_history_item.bind(this)}
                    persons={this.state.persons}/>
            );
         });
      return (
        <ScrollView keyboardShouldPersistTaps='always' style={styles.scrollView}>
          <View style={styles.ScrollView}>
              <AddHistory
              type={this.state.type}
              persons={this.state.persons}
              add_update_history_item={this.add_update_history_item.bind(this)}/>
              {history}
          </View>
        </ScrollView>
      );
    }
  }
}