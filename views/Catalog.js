const React = require('react')
class Catalog extends React.Component {
    render() {
        let catalog = '<ul class="products">'
        for (let i=1; i<9; i++){
            catalog += '<Product href = ",/"' + i + '/>'
        }
        catalog += '</ul>'
        return catalog
    }
}
const Product = (props) => (
    <li className="product-wrapper">
        <a href={props.href} className="product"></a>
    </li>
)

module.exports = Catalog