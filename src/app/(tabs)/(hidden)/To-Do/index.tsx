import AppHeader from '@/src/components/AppHeader';
import { AddTaskModal } from '@/src/components/to-do/AddTaskModal';
import { PRIMARY_COLOR } from '@/src/constants/colors';
import { getTabColor } from '@/src/utils/functions';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { AnimatedFAB, DefaultTheme, PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import DoneList from './DoneList';
import InProgressList from './InProgress';
import ToDoList from './ToDo';
export default function ToDo() {
  const { t } = useTranslation();
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [visible, setVisible] = React.useState(false);

  const hideModal = () => setVisible(false);

  const routes = [
    { key: 'first', title: t("todo.filter.todo") },
    { key: 'second', title: t("todo.filter.inProgress") },
    { key: 'third', title: t("todo.filter.done") },
  ];

  const renderScene = SceneMap({
    first: ToDoList,
    second: InProgressList,
    third: DoneList,
  });

  return (
      <PaperProvider
      theme={
        {
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            background: '#f3f4f6',
            surface: 'white',
            primary: PRIMARY_COLOR,
          },
        }
      }
    >
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

      {/* AnimatedFAB global */}
      <AnimatedFAB
        icon="plus"
        label={t("todo.addTaskButton")}
        color="white"
        extended={true}
        onPress={() => setVisible(true)}
        visible
        animateFrom="right"
        iconMode="dynamic"
        style={{
          position: "absolute",
          bottom: 16,
          right: 16,
          backgroundColor: PRIMARY_COLOR,
          borderRadius: 16,
          elevation: 6,
        }}
        theme={{
          colors: { onSecondaryContainer: "white" },
        }}
      />

      {/* Modal */}
      {visible && <AddTaskModal visible={visible} hideModal={hideModal} />}
    </SafeAreaView>
  </PaperProvider>

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