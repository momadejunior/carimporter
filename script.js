document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('table-body');
    const addRowBtn = document.getElementById('add-row-btn');
    const sampleDataBtn = document.getElementById('sample-data-btn');
    const clearAllBtn = document.getElementById('clear-all-btn');
    const exportCsvBtn = document.getElementById('export-csv-btn');
    const exportXlsxBtn = document.getElementById('export-xlsx-btn');

    const headers = ['Title', 'Description', 'Price', 'Brand', 'Year', 'Kms', 'Engine', 'Condition', 'ListingType', 'Model', 'Images'];

    // Initial Row
    addRow();

    // Event Listeners
    addRowBtn.addEventListener('click', () => addRow());
    sampleDataBtn.addEventListener('click', fillSampleData);
    clearAllBtn.addEventListener('click', clearAll);
    exportCsvBtn.addEventListener('click', exportCSV);
    exportXlsxBtn.addEventListener('click', exportXLSX);

    function addRow(data = {}) {
        const row = document.createElement('tr');
        const index = tableBody.children.length + 1;

        row.innerHTML = `
            <td class="row-index">${index}</td>
            <td><input type="text" class="field-title" placeholder="Título (Original)" value="${data.Title || ''}"></td>
            <td><input type="text" class="field-brand" placeholder="Marca (Ex: BMW)" value="${data.Brand || ''}"></td>
            <td><input type="text" class="field-model" placeholder="Modelo (Ex: 320i)" value="${data.Model || ''}"></td>
            <td><input type="number" class="field-price" placeholder="Preço" value="${data.Price || ''}"></td>
            <td><input type="number" class="field-year" placeholder="2024" value="${data.Year || ''}"></td>
            <td><input type="number" class="field-kms" placeholder="Km" value="${data.Kms || ''}"></td>
            <td><input type="text" class="field-engine" placeholder="Motor (Ex: 2.0)" value="${data.Engine || ''}"></td>
            <td>
                <select class="field-condition">
                    <option value="Used" ${data.Condition === 'Used' ? 'selected' : ''}>Usado</option>
                    <option value="New" ${data.Condition === 'New' ? 'selected' : ''}>Novo</option>
                </select>
            </td>
            <td>
                <select class="field-listingtype">
                    <option value="carros usados" ${data.ListingType === 'carros usados' ? 'selected' : ''}>Carros Usados</option>
                    <option value="alugar carro" ${data.ListingType === 'alugar carro' ? 'selected' : ''}>Alugar Carro</option>
                    <option value="importar carro" ${data.ListingType === 'importar carro' ? 'selected' : ''}>Importar Carro</option>
                    <option value="carros no parque" ${data.ListingType === 'carros no parque' ? 'selected' : ''}>Carros no Parque</option>
                </select>
            </td>
            <td>
                <div class="file-input-wrapper">
                    <button class="btn browse-btn">Selecionar Fotos</button>
                    <input type="file" class="field-images" multiple accept="image/*" style="display: none;">
                    <div class="selected-files-count">Sem fotos</div>
                </div>
            </td>
            <td>
                <button class="btn-icon delete" title="Remover Carro">
                    🗑️
                </button>
            </td>
        `;

        const fileInputWrapper = row.querySelector('.file-input-wrapper');
        const fileInput = fileInputWrapper.querySelector('.field-images');
        const browseBtn = fileInputWrapper.querySelector('.browse-btn');
        const countDisplay = fileInputWrapper.querySelector('.selected-files-count');

        browseBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', () => {
            const files = Array.from(fileInput.files);
            const names = files.map(f => f.name).join(', ');
            countDisplay.textContent = files.length > 0 ? `${files.length} fotos selecionadas` : 'Sem fotos';
            countDisplay.title = names;
            // Store names in a data attribute for easier collection
            fileInput.dataset.filenames = names;
        });

        // Pre-fill filenames if data exists
        if (data.Images) {
            fileInput.dataset.filenames = data.Images;
            const count = data.Images.split(',').length;
            countDisplay.textContent = `${count} fotos (carregadas)`;
            countDisplay.title = data.Images;
        }
        // Description field
        const titleTd = row.querySelectorAll('td')[1];
        const descInput = document.createElement('textarea');
        descInput.className = 'field-description';
        descInput.placeholder = 'Descrição detalhada do veículo...';
        descInput.value = data.Description || '';
        descInput.style.marginTop = '4px';
        titleTd.appendChild(descInput);

        const delBtn = row.querySelector('.delete');
        delBtn.addEventListener('click', () => {
            row.remove();
            updateIndices();
        });

        tableBody.appendChild(row);
    }

    function updateIndices() {
        Array.from(tableBody.children).forEach((row, i) => {
            row.querySelector('.row-index').textContent = i + 1;
        });
    }

    function fillSampleData() {
        const samples = [
            { Title: 'BMW M3 Competition', Description: 'Estado impecável, full extras, revisões na marca.', Price: 85000, Brand: 'BMW', Year: 2022, Kms: 5000, Engine: '3.0L', Condition: 'Used', ListingType: 'carros usados', Model: 'M3', Images: 'bmw1.jpg, bmw2.jpg' },
            { Title: 'Toyota Corolla Hybrid', Description: 'Muito económico, versão full extras, garantia de fábrica.', Price: 28000, Brand: 'Toyota', Year: 2023, Kms: 0, Engine: '1.8L', Condition: 'New', ListingType: 'carros usados', Model: 'Corolla', Images: 'toyota1.jpg' }
        ];

        clearAll();
        samples.forEach(s => addRow(s));
    }

    function clearAll() {
        tableBody.innerHTML = '';
        addRow();
    }

    function collectData() {
        const rows = Array.from(tableBody.children);
        return rows.map(row => {
            const fileInput = row.querySelector('.field-images');
            return {
                Title: row.querySelector('.field-title').value,
                Description: row.querySelector('.field-description').value,
                Price: row.querySelector('.field-price').value,
                Brand: row.querySelector('.field-brand').value,
                Year: row.querySelector('.field-year').value,
                Kms: row.querySelector('.field-kms').value,
                Engine: row.querySelector('.field-engine').value,
                Condition: row.querySelector('.field-condition').value,
                ListingType: row.querySelector('.field-listingtype').value,
                Model: row.querySelector('.field-model').value,
                Images: fileInput.dataset.filenames || ''
            };
        }).filter(item => item.Title.trim() !== '');
    }

    function exportCSV() {
        const data = collectData();
        if (data.length === 0) return alert('Adicione os dados do carro primeiro!');

        const csvRows = [];
        csvRows.push(headers.join(','));

        for (const row of data) {
            const values = headers.map(header => {
                const val = row[header] || '';
                const escaped = ('' + val).replace(/"/g, '""');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        }

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'lista_de_carros.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function exportXLSX() {
        const data = collectData();
        if (data.length === 0) return alert('Adicione os dados do carro primeiro!');

        const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Listings");
        
        XLSX.writeFile(workbook, "lista_de_carros.xlsx");
    }
});
