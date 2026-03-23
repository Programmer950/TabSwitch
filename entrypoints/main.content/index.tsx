import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './style.css';

export default defineContentScript({
    matches: ['<all_urls>'], // Inject on every website
    cssInjectionMode: 'ui',
    async main(ctx) {
        const ui = await createShadowRootUi(ctx, {
            name: 'tab-switcher-ui',
            position: 'inline',
            anchor: 'body',
            append: 'last',
            onMount: (container) => {
                const root = ReactDOM.createRoot(container);
                root.render(<App />);
                return root;
            },
            onRemove: (root) => {
                root?.unmount();
            },
        });

        ui.mount();
    },
});