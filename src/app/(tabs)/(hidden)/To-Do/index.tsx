import AppHeader from '@/src/components/AppHeader';
import { routes } from '@/src/constants';
import { getTabColor } from '@/src/utils/functions';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import DoneList from './DoneList';
import InProgressList from './InProgress';
import ToDoList from './ToDo';

const renderScene = SceneMap({
  first: ToDoList,
  second: InProgressList,
  third: DoneList,
});

export default function ToDo() {
  const { t } = useTranslation();
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  return (
    <SafeAreaView className='flex-1 bg-[#F9FAFB]'>
      <AppHeader moduleName={t("modulesNames.toDo")} />

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={[
              styles.indicator,
              { backgroundColor: getTabColor(routes[index].key) }
            ]}
            style={styles.tabBar}
            activeColor={getTabColor(routes[index].key)}
            inactiveColor="#9CA3AF"
            pressColor="rgba(0, 0, 0, 0.05)"
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  indicator: {
    height: 3,
    borderRadius: 3,
  },
});