export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Code to Video Creator</title>
      </head>
      <body>{children}</body>
    </html>
  );
}