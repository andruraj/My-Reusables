/**
 *
 *
 * @param {string} text
 * @param {string} success
 * @param {string} failure
 */
function fallbackCopyTextToClipboard(text, success, failure) {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand("copy");
    var msg = successful ? success : failure;
    console.log("Fallback: " + msg);
    alert(msg);
  } catch (err) {
    console.error("Fallback: " + failure, err);
  }

  document.body.removeChild(textArea);
}

/**
 *
 *
 * @export
 * @param {string} text
 * @param {string} [success="Copying to clipboard was successful!"]
 * @param {string} [failure="Oops, Unable to Copy"]
 * @return {*}
 */
export function copyTextToClipboard(
  text,
  success = "Copying to clipboard was successful!",
  failure = "Oops, Unable to Copy"
) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text, success, failure);
    return;
  }
  navigator.clipboard.writeText(text).then(
    function () {
      console.log("Async: " + success);
      alert(success);
    },
    function (err) {
      console.error("Async: " + failure, err);
    }
  );
}
