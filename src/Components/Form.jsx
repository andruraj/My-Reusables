/* The code is defining a React component called `Form`. This component is used to render a form with
customizable properties and behavior. */
/**
 * @param {{children: React.ReactNode, onSubmit: (e: React.FormEvent, data: any) => void} & React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>} parameters
 *
 * @returns {React.ReactNode} Result
 */
export const Form = ({ onSubmit, children, ...props }) => {
  /**
   * Validate custom elements with 'formElement' attribute
   * @param {HTMLFormElement} formElement The form element
   * @returns {boolean} Whether all custom elements are valid
   */
  const validateCustomElements = (formElement) => {
    let isValid = true;

    // Recursively check validity of elements with 'input' attribute
    const recursiveCheckValidity = (element) => {
      if (element.dataset.input) {
        // Check if element is mandatory
        const mandatoryElement = element.querySelector("[data-mandatory]");

        if (mandatoryElement && mandatoryElement.dataset.mandatory === "true") {
          if (!!!mandatoryElement.textContent.trim()) {
            isValid = false;
            element.dataset.invalid = true;

            mandatoryElement.children[0].dispatchEvent(new Event("invalid"));
          }
        }
      }

      // Recursively check children
      Array.from(element.children).forEach((child) => {
        recursiveCheckValidity(child);
      });
    };

    // Start recursion from the form element
    recursiveCheckValidity(formElement);

    return isValid;
  };

  /**
   * @param {React.FormEvent} e
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    const formElement = e.target;

    // Check the validity of all form controls
    const isFormValid = formElement.checkValidity();

    // Additional validation for elements with 'formElement' attribute
    const isCustomValid = validateCustomElements(formElement);

    // Focus the first invalid field
    if (!isFormValid || !isCustomValid) {
      const firstInvalidField = formElement.querySelector(
        "[data-input][data-invalid], :invalid"
      );

      if (firstInvalidField) {
        firstInvalidField.focus();
      }
      return;
    }

    // Submit the data if both form and custom validations pass
    const formData = new FormData(formElement);
    if (!!onSubmit) onSubmit(e, Object.fromEntries(formData));
  };

  return (
    <form onSubmit={handleSubmit} noValidate {...props}>
      {children}
    </form>
  );
};
