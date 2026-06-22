#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_os::init());

    // Autostart has no iOS/Android implementation — register it on desktop only
    // so mobile builds (Phase 4) compile. The crate is also a desktop-only
    // dependency in Cargo.toml for the same reason.
    #[cfg(not(any(target_os = "ios", target_os = "android")))]
    let builder = builder.plugin(tauri_plugin_autostart::init(
        tauri_plugin_autostart::MacosLauncher::LaunchAgent,
        None,
    ));

    // Cross-device update sync (Phase 4) — desktop only. The updater plugin has no
    // mobile implementation; the dialog/process plugins are only needed for the
    // desktop "Update available" prompt and relaunch. All three are desktop-only
    // dependencies in Cargo.toml for the same reason, so mobile builds (Phase 5)
    // exclude them entirely.
    #[cfg(desktop)]
    let builder = builder
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_dialog::init());

    builder
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
