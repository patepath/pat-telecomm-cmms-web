import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'cmms';
}

const firebaseConfig = {
  apiKey: "AIzaSyCstjewyFZtun8LZjpnGuGLQqwlwGr2ZbI",
  authDomain: "cmms-4e002.firebaseapp.com",
  projectId: "cmms-4e002",
  storageBucket: "cmms-4e002.appspot.com",
  messagingSenderId: "385434152325",
  appId: "1:385434152325:web:221cee55d71085175aa8ec",
  measurementId: "G-XPGQXZX3VX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);