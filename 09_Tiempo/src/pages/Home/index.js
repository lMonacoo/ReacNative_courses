import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, FlatList } from 'react-native';

import * as Location from 'expo-location';

import Menu from '../../components/Menu';
import Header from '../../components/Header';
import Conditions from '../../components/Conditions';
import Forecast from '../../components/Forecast';

import api, { key } from '../../services/api';

import { condition } from '../../utils/condition';


//Componente com a primeira leta maiúscula
export default function Home() {

    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [weather, setWeather] = useState();
    const [icon, SetIcon] = useState({ name: 'cloud', color: '#fff' });
    const [background, setBackground] = useState(['#1ED6FF', '#97C1FF']);


    useEffect(() => {

        (async () => {
            let { status } = await Location.requestPermissionsAsync();

            if (status != 'granted') {
                setErrorMsg('Permissao negada para acessar localizacao');
                setLoading(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            console.log(location.coords.latitude);

            //weather?key=76bce48c&lat=-23.682&lon=-46.875
            const response = await api.get(`/weather?key=${key}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`);
            // console.log(response.data);
            setWeather(response.data);

            if (response.data.results.currently === 'noite') {
                setBackground(['#0c3741', '#0f2f61']);
            }

            switch (response.data.results.condition_slug) {
                case 'clear_day':
                    setIcon({ name: 'partly-sunny', color: '#FFB300' })
                    break;
                case 'rain':
                    setIcon({ name: 'rainy', color: '#FFF' })
                    break;
                case 'storm':
                    setIcon({ name: 'rainy', color: '#FFF' })
                    break;
            }

            setLoading(false);

        })();

    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={{ fontSize: 17, fontStyle: 'italic' }}>Carregando Dados...</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>

            <Menu />
            <Header background={background} weather={weather} icon={icon} />
            <Conditions weather={weather} />

            <FlatList
                showsHorizontalScrollIndicator={false}
                style={styles.list}
                horizontal={true}
                contentContainerStyle={{ paddingBottom: '5%' }}
                data={weather.results.forecast}
                keyExtractor={item => item.date}
                renderItem={({ item }) => <Forecast data={item} />}
            />

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e8F9FF',
        paddingTop: '5%',
    },
    list: {
        marginTop: 10,
        marginLeft: 10,
    }
});