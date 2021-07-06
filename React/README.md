# React


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). 

The main steps are:
-  The `columns|editCellComponent` option is used to display dxDataGrid in the editing form
- dxDataGrid operates data in Controlled mode via the [changes](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/editing/changes/) option
-  The `utils.js` file contains a possible implementation of handling the shared state and data processing actions.
-  In the detail dxDataGrid, we handled [onSaved](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/#onSaved) to pass changes from the detail grid to the React State.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Further help

You can learn more about React in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To get more help on DevExtreme submit an issue on [GitHub](https://github.com/DevExpress/devextreme/issues) or [Support Center](https://www.devexpress.com/Support/Center/Question/Create)



