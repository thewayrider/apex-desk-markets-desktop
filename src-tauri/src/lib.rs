// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg(target_os = "windows")]
use tauri::{Manager, WebviewWindow};
#[cfg(target_os = "windows")]
use windows::Win32::Foundation::HWND;
#[cfg(target_os = "windows")]
use windows::Win32::UI::WindowsAndMessaging::WS_EX_TOOLWINDOW;

#[cfg(target_os = "windows")]
fn pin_to_desktop(window: &WebviewWindow) {
    unsafe {
        let hwnd_isize: isize = std::mem::transmute(window.hwnd().unwrap());
        let hwnd = HWND(hwnd_isize as *mut core::ffi::c_void);

        #[cfg(target_pointer_width = "32")]
        {
            use windows::Win32::UI::WindowsAndMessaging::{GetWindowLongW, SetWindowLongW, GWL_EXSTYLE};
            let exstyle = GetWindowLongW(hwnd, GWL_EXSTYLE);
            SetWindowLongW(hwnd, GWL_EXSTYLE, exstyle | WS_EX_TOOLWINDOW.0 as i32);
        }
        #[cfg(target_pointer_width = "64")]
        {
            use windows::Win32::UI::WindowsAndMessaging::{GetWindowLongPtrW, SetWindowLongPtrW, GWL_EXSTYLE};
            let exstyle = GetWindowLongPtrW(hwnd, GWL_EXSTYLE);
            SetWindowLongPtrW(hwnd, GWL_EXSTYLE, exstyle | WS_EX_TOOLWINDOW.0 as isize);
        }

        use windows::Win32::UI::WindowsAndMessaging::{SetWindowPos, HWND_BOTTOM, SWP_NOMOVE, SWP_NOSIZE, SWP_NOACTIVATE};
        
        let _ = SetWindowPos(
            hwnd,
            HWND_BOTTOM,
            0, 0, 0, 0,
            SWP_NOMOVE | SWP_NOSIZE | SWP_NOACTIVATE,
        );

        let _ = window.show();
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .setup(|app| {
            #[cfg(target_os = "windows")]
            {
                let main_window = app.get_webview_window("main").unwrap();
                pin_to_desktop(&main_window);
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
