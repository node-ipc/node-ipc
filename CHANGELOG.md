# Changelog

# v12.x

## v12.0.0 (UNRELEASED)

- `serve`, `serveNet`, `connectTo` and `connectToNet` are now async. Instead of passing a callback as an argument, you can now either `await` it or use `ipc.serve().then(callback)`.
