import AsyncStorage from '@react-native-community/async-storage';

export function getOrderedKeys(dict, attribute){
    /** this function goes through a dictionary returns a list of keys after sorting the dictionary by a values name */
    dict = Object.assign({}, dict);
    if(dict){
        var items = Object.keys(dict).map(function(key) {
          return [key, dict[key]];
        });
        if(attribute == 'name'){
            items.sort(function(a, b) {
              return a[1][attribute].toUpperCase() > b[1][attribute].toUpperCase();
            });
        } else {
            items.sort(function(a, b) {
              return a[1][attribute] < b[1][attribute];
            });
        }
        items = items.map(function(key) {
            return key[0];
        });
    } else {
        var items = [];
    }
    return items
}

/** returns an object which is stored in the devices database */
export async function getItemFromStorage(itemString) {
  /** //TODO: verify this
        itemString options are:
            cur_emp
            hours
            jobs
            departments
            employees
            settings
            personal
    */
  try {
    let item = '{}';
    item = (await AsyncStorage.getItem(itemString)) || '{}';
    if(itemString == 'type' && item == '{}'){
        item = {
            1: {pk: 1, name: 'Short', normal_rate: 0.20, trays_per_box: 450, visible: true}
        };
        await setItemInStorage(itemString, item);
        return (item);
    }else if(itemString == 'persons' && item == '{}'){
            item = {
                1: {pk: 1, name: 'Dax', visible: true}
            };
            await setItemInStorage(itemString, item);
            return (item);
    }
    return JSON.parse(item);
  } catch (error) {
    console.log(error);
    return null;
  }
}

/** returns an object which is stored in the devices database */
export async function setItemInStorage(itemString, new_item) {
  /** //TODO: verify this
        itemString options are:
            cur_emp
            hours
            jobs
            departments
            employees
            settings
            personal
    */
  try {
    await AsyncStorage.setItem(itemString, JSON.stringify(new_item));
    return true;
  } catch (error) {
    console.log(error);
    console.log(new_item);
    return null;
  }
}

export function build_display_date(in_date) {
  let day = in_date.getDate();
  if(day < 10) {
    day = '0' + day.toString();
  } else {
    day = day.toString();
  }
  let month = in_date.getMonth() + 1;
  if(month < 10){
    month = '0' + month.toString()
  } else if (month > 13) {
    month = '01'
  } else {
    month = month.toString()
  }

  let year = in_date.getFullYear();
  return month + '-' + day + '-' + year.toString();
}