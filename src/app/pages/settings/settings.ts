import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Topbar } from '../../shared/topbar/topbar';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Topbar],
  templateUrl: './settings.html',
  styleUrls: ['./settings.scss']
})
export class SettingsComponent implements OnInit {
  companyName: string = '';
  address: string = '';

  preferences = {
    darkMode: false,
    analytics: false,
    autoUpdate: false
  };

  message: string = '';
  isError: boolean = false;

  ngOnInit() {
    this.loadSettings();
  }

  /** ✅ Load saved settings from localStorage */
  private loadSettings() {
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        this.companyName = parsed.companyName || '';
        this.address = parsed.address || '';
        this.preferences = {
          darkMode: parsed.darkMode ?? false,
          analytics: parsed.analytics ?? false,
          autoUpdate: parsed.autoUpdate ?? false
        };
      } catch (e) {
        console.error('Error parsing settings:', e);
      }
    }

    // ✅ Apply theme on load
    document.body.classList.toggle('dark-theme', this.preferences.darkMode);
  }

  /** ✅ Toggle dark theme immediately */
  toggleTheme(event: Event) {
    this.preferences.darkMode = (event.target as HTMLInputElement).checked;
    document.body.classList.toggle('dark-theme', this.preferences.darkMode);
    localStorage.setItem('darkMode', String(this.preferences.darkMode));
  }

  /** ✅ Save settings with validation */
saveChanges() {
  try {
    if (!this.companyName.trim()) {
      this.showMessage('❌ Company name is required!', true);
      return;
    }
    if (!this.address.trim()) {
      this.showMessage('❌ Address is required!', true);
      return;
    }

    const settings = {
      companyName: this.companyName,
      address: this.address,
      ...this.preferences
    };

    localStorage.setItem('settings', JSON.stringify(settings));
    localStorage.setItem('darkMode', String(this.preferences.darkMode));

    // 🔹 Mock actions for demo
    if (this.preferences.analytics) {
      console.log("📊 Analytics enabled → sending anonymous usage data...");
    } else {
      console.log("📊 Analytics disabled → no data will be sent.");
    }

    if (this.preferences.autoUpdate) {
      console.log("🔄 Automatic updates enabled → system will auto-check for updates.");
    } else {
      console.log("🔄 Automatic updates disabled → manual updates only.");
    }

    this.showMessage('✅ Settings saved successfully!', false);
  } catch (error) {
    console.error('Error saving settings:', error);
    this.showMessage('❌ Failed to save settings. Please try again.', true);
  }
}


  /** ✅ Cancel → restore saved settings instead of clearing */
  cancel() {
    this.loadSettings();
    this.showMessage('⚠️ Changes discarded. Restored last saved settings.', true);
  }

  /** ✅ Show message with auto-hide */
  private showMessage(msg: string, isError: boolean) {
    this.message = msg;
    this.isError = isError;

    // Auto-hide after 3 seconds
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }
}
