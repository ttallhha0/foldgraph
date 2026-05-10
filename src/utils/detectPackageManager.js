// Yaygın Python (pip) paketleri — bu listede bulunanlar otomatik pip olarak etiketlenir.
// Listede olmayanlar npm olarak kabul edilir.
const PIP_PACKAGES = new Set([
  // Veri bilimi / ML
  'numpy','pandas','matplotlib','scipy','scikit-learn','sklearn',
  'tensorflow','tensorflow-gpu','torch','torchvision','torchaudio',
  'keras','xgboost','lightgbm','catboost','statsmodels',
  'seaborn','plotly','bokeh','altair','dash',
  'jupyter','notebook','jupyterlab','ipython','ipywidgets',
  // Web framework
  'flask','django','fastapi','starlette','tornado','bottle','falcon',
  'sanic','aiohttp','quart','litestar','blacksheep',
  // HTTP / scraping
  'requests','httpx','urllib3','aiohttp','httpcore',
  'beautifulsoup4','bs4','scrapy','playwright','selenium',
  'mechanize','httplib2','grequests','pycurl',
  // Veritabanı / ORM
  'sqlalchemy','alembic','tortoise-orm','peewee','ponyorm',
  'pymongo','motor','redis','aioredis','elasticsearch',
  'psycopg2','psycopg2-binary','pymysql','aiomysql',
  'databases','sqlmodel','piccolo',
  // Async / sistem
  'asyncio','uvloop','anyio','trio','gevent','twisted',
  'celery','dramatiq','rq','huey','apscheduler',
  'paramiko','fabric','invoke','sh',
  // DevOps / cloud
  'boto3','botocore','google-cloud-storage','google-auth',
  'azure-storage-blob','azure-identity',
  'kubernetes','docker','ansible','terraform',
  'pyyaml','toml','dotenv','python-dotenv',
  // NLP / AI
  'transformers','tokenizers','datasets','diffusers','accelerate',
  'nltk','spacy','gensim','sentence-transformers',
  'openai','anthropic','langchain','llama-index','llamaindex',
  'tiktoken','cohere','huggingface-hub',
  // Görüntü işleme
  'pillow','opencv-python','opencv-python-headless','imageio',
  'scikit-image','skimage','wand','cairosvg',
  // Test
  'pytest','pytest-asyncio','pytest-cov','hypothesis','unittest2',
  'mock','responses','faker','factory-boy','freezegun',
  // Kod kalitesi
  'black','flake8','pylint','mypy','ruff','isort','autopep8','bandit',
  // Paket yönetimi
  'setuptools','wheel','twine','build','flit','hatch','poetry',
  'virtualenv','pipenv','pip-tools',
  // Diğer yaygınlar
  'click','typer','rich','textual','blessed','colorama',
  'pydantic','pydantic-settings','attrs','dataclasses-json',
  'arrow','pendulum','dateutil','python-dateutil',
  'cryptography','bcrypt','passlib','jwt','python-jose',
  'lxml','html5lib','defusedxml','xmltodict',
  'tqdm','alive-progress','loguru','structlog',
  'pytest-mock','nox','pre-commit',
]);

/**
 * Paket adına göre paket yöneticisini tespit eder.
 * @param {string} name
 * @returns {'pip' | 'npm'}
 */
export function detectManager(name) {
  return PIP_PACKAGES.has(name.toLowerCase()) ? 'pip' : 'npm';
}
