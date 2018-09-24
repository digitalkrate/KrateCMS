export default function getMimeType(fileExtension: string) {
  switch (fileExtension.toLowerCase()) {
    case "css":
      return "text/css";
    case "js":
      return "application/javascript";
    case "json":
      return "application/json";
    default:
      return "text/plain";
  }
}
