import { Component, AfterViewInit } from '@angular/core';

declare const google: any;

@Component({
  selector: 'app-contact-component',
  standalone: true,
  imports: [],
  templateUrl: './contact-component.html',
  styleUrl: './contact-component.scss'
})
export class ContactComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    this.waitForGoogleMaps();
  }

  /**
   * Wait until Google Maps script is loaded
   */
  waitForGoogleMaps() {
    const check = setInterval(() => {
      if ((window as any).google && (window as any).google.maps) {
        clearInterval(check);
        this.initAncientMap();
      }
    }, 100);
  }

  /**
   * Initialize Ancient Styled Google Map
   */
  initAncientMap() {

    // 🔴 CHANGE THIS TO YOUR REAL STUDIO LOCATION
    const studioLocation = {
      lat: 12.9716,   // Example: Bangalore
      lng: 77.5946
    };

    const ancientMapStyle = [
      { elementType: 'geometry', stylers: [{ color: '#1a2b1f' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#9fb7a6' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#030b07' }] },
      { featureType: 'water', stylers: [{ color: '#0b2e22' }] },
      { featureType: 'road', stylers: [{ color: '#2a3b30' }] },
      { featureType: 'poi', stylers: [{ visibility: 'off' }] },
      { featureType: 'transit', stylers: [{ visibility: 'off' }] }
    ];

    const mapElement = document.getElementById('ancientMap');
    if (!mapElement) return;

    const map = new google.maps.Map(mapElement, {
      center: studioLocation,
      zoom: 14,
      styles: ancientMapStyle,
      disableDefaultUI: true,
      gestureHandling: 'cooperative'
    });

    // 🟢 Ancient Marker
    new google.maps.Marker({
      position: studioLocation,
      map,
      title: 'The Sanctum',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 9,
        fillColor: '#3aff9e',
        fillOpacity: 1,
        strokeColor: '#0b2e22',
        strokeWeight: 2
      }
    });
  }
}
