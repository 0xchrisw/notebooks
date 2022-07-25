

import shutil
import requests

from pathlib import Path
from io import BytesIO
from urllib.parse import urlparse
from zipfile import ZipFile


class GithubDownloader:
  def __init__(self, url, destination="./"):
    self.url = url = self.check_url(url)
    self.destination = destination
    self.repo = self.check_repo(url)  # Ensure repo is valid.
    if not url: raise ValueError("Invalid URL")        # Invalid URL
    if not self.repo: raise ValueError("Invalid Repo") # Invalid Repository
    # Start the download
    self.download()

  def check_url(self, url):
    if 'github.com/' not in url: return False
    if 'http' not in url: url = 'https://' + url            # Add prefix if missing.
    return urlparse(url)._replace(scheme="https").geturl()  # Ensure prefix is 'https://'.

  def check_repo(self, url):
    if url:
      if requests.head(url).status_code != 200: return False
      owner, repo = urlparse(url).path.split('/')[1:]
      return {'owner': owner, 'repo': repo}
    return False


  def download(self):
    dest_dir   = Path(f"{self.destination}/{self.repo['repo']}")
    dest_zip   = Path(f"{dest_dir}/{self.repo['repo']}.zip")
    extracted_dir = Path(f"{dest_dir}/{self.repo['repo']}-master")

    if not extracted_dir.exists():
      if not dest_dir.exists(): dest_dir.mkdir(parents=True, exist_ok=True)
      _r = requests.get(f"https://github.com/{self.repo['owner']}/{self.repo['repo']}/archive/refs/heads/master.zip")
      # _z = ZipFile(BytesIO(_r.content))
      dest_zip.write_bytes(_r.content)        # Write the zip to the file.
      ZipFile(dest_zip).extractall(dest_dir)  # Extract the zip to the directory.
      if dest_zip.exists(): dest_zip.unlink() # Delete the zip file.

      # Move files to the top level directory.
      _extracted = [f for f in extracted_dir.iterdir()]
      for f in _extracted:
        shutil.move(f, dest_dir)

