import React, { Component } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import Mapbox from '@mapbox/react-native-mapbox-gl'

Mapbox.setAccessToken('pk.eyJ1IjoiZHhhcmF1am8iLCJhIjoiY2ptdmNjM2p2MGVtYTN3bzJxaTh2d3hnZiJ9.m3Is54pCBhA6dtnHLa8rhg')

export default class App extends Component {

	state = { locations: [0, 0] }

	_map = null
	_watchID = null

	componentDidMount = () => {
		this._watchID = navigator.geolocation.watchPosition(p => {
			const { latitude, longitude } = p.coords
			this.setState({ locations: [longitude, latitude] })
		})
	}

	componentWillUnmount = () => {
		navigator.geolocation.clearWatch(this._watchID)
	}

	handleUpdateUserLocation(center) {
		this._map && this._map.moveTo([center.coords.longitude, center.coords.latitude])
	}

	renderAnnotations() {
		return (
			<Mapbox.PointAnnotation
				key='pointAnnotation'
				id='pointAnnotation'
				coordinate={this.state.locations}>
				<View style={styles.annotationContainer}>
					<View style={styles.annotationFill} />
				</View>
				<Mapbox.Callout title='Look! An annotation!' />
			</Mapbox.PointAnnotation>
		)
	}

	render() {
		return (
			<View style={styles.container}>
				<Mapbox.MapView
					ref={map => { this._map = map }}
					styleURL={Mapbox.StyleURL.StyleSheet}
					zoomLevel={20}
					centerCoordinate={this.state.locations}
					style={styles.container}
					userTrackingMode={Mapbox.UserTrackingModes.Follow}
					showUserLocation
					onUserLocationUpdate={center => this.handleUpdateUserLocation(center)}>
					{this.renderAnnotations()}
				</Mapbox.MapView>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	annotationContainer: {
		width: 30,
		height: 30,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'white',
		borderRadius: 15,
	},
	annotationFill: {
		width: 30,
		height: 30,
		borderRadius: 15,
		backgroundColor: 'orange',
		transform: [{ scale: 0.6 }],
	},
})