export default function validateProduct(values) {
        let errors = {}

        // Validar el nombre del usuario
        if (!values.name) {
            errors.name = 'Must enter a name'
        }

        // validar empresa
        if (!values.company) {
            errors.company = 'Must enter a company name'
        }

        // validar la url
        if (!values.url) {
            errors.url = 'Must enter a URL'
        } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(values.url)) {
            errors.url = 'Must enter a valid URL'
        }

        // validar descripción.
        if (!values.description) {
            errors.description = 'Add a product description'
        }

        return errors
}
