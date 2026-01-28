import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-contact',
  templateUrl: './contact-component.html',
  styleUrl: './contact-component.scss'
})
export class ContactComponent implements AfterViewInit {
  private map!: L.Map;
  displayedCoords: string = "SCANNING...";
  private readonly chennai: [number, number] = [13.198778,80.316250];

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: this.chennai,
      zoom: 12,
      zoomControl: false,
      // PREVENT POPUP CLOSING: This stops clicking the map from closing the popup
      closePopupOnClick: false 
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '© OpenStreetMap'
    });

    tiles.addTo(this.map);

    this.map.on('mousemove', (e: L.LeafletMouseEvent) => {
      this.displayedCoords = `${e.latlng.lat.toFixed(4)}° N, ${e.latlng.lng.toFixed(4)}° E`;
    });

    this.map.on('mouseout', () => {
      this.displayedCoords = "SCANNING...";
    });

    const icon = L.divIcon({
      className: 'custom-marker',
      iconSize: [12, 12]
    });

    // MARKER CONFIGURATION
    const marker = L.marker(this.chennai, { 
      icon,
      interactive: true // Ensure the marker can hold the popup
    }).addTo(this.map);

    // POPUP CONFIGURATION
    marker.bindPopup('<b>Limat Studio</b><br>Chennai, India', {
      autoClose: false,     // Prevent closing when another popup opens
      closeOnClick: false,  // Prevent closing when map is clicked
      closeButton: false,   // Remove the 'x' button so it can't be closed manually
      className: 'ancient-popup' // Custom class for styling
    }).openPopup();
  }

  resetMap() {
    this.map.flyTo(this.chennai, 12);
  }
}
