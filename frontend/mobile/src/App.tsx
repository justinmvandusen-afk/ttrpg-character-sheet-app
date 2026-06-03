import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Provider } from 'react-redux'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import store from './store/store'

import { LoginScreen } from './screens/LoginScreen'
import { GamesScreen } from './screens/GamesScreen'
import { CharacterListScreen } from './screens/CharacterListScreen'
import { CharacterDetailScreen } from './screens/CharacterDetailScreen'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  )
}

const GamesStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="GamesList"
        component={GamesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GameDetail"
        component={CharacterListScreen}
        options={{ title: 'Characters' }}
      />
      <Stack.Screen
        name="CharacterDetail"
        component={CharacterDetailScreen}
        options={{ title: 'Character Sheet' }}
      />
    </Stack.Navigator>
  )
}

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#0284c7',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tab.Screen
        name="Games"
        component={GamesStack}
        options={{
          title: 'My Games',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="dice-d20" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Characters"
        component={GamesStack}
        options={{
          title: 'Characters',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-multiple" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={GamesStack}
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const RootNavigator = () => {
  const [initialRoute, setInitialRoute] = React.useState('Auth')

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Auth" component={AuthStack} />
      <Stack.Screen name="Main" component={MainTabs} />
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </Provider>
  )
}
